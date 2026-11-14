import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  type CheckRun,
  evaluateChecks,
  type MergedPull,
  type Verdict,
} from "./checks";
import { readReleaseConfig, validateAppConfig } from "./config";
import { getToken, githubRequest, parseRemote } from "./github";
import { git, gitOrThrow } from "./run";
import { latestTag, type ReleaseKind } from "./tags";

/** The part of a pull request of the REST API that is read here. */
interface ApiPull {
  number: number;
  merged_at: string | null;
  base?: { ref?: string };
  head?: { sha?: string };
}

export const DEFAULT_CONFIG_PATH = "projects.json";

/** The trunk each kind of release comes from: a candidate from `staging`, a final release from `main`. */
export function branchOf(kind: ReleaseKind) {
  return kind === "rc" ? "staging" : "main";
}

/** The folder of the app whose `package.json` has this name (the `projectId`), looked for in `apps/` and `workers/`. */
export function findAppPath(projectId: string, root = ".") {
  for (const group of ["apps", "workers"]) {
    const groupPath = join(root, group);

    if (!existsSync(groupPath)) {
      continue;
    }

    for (const folder of readdirSync(groupPath)) {
      const manifest = join(groupPath, folder, "package.json");

      if (
        existsSync(manifest) &&
        (JSON.parse(readFileSync(manifest, "utf8")) as { name?: string })
          .name === projectId
      ) {
        return `${group}/${folder}`;
      }
    }
  }

  return null;
}

export interface InspectOptions {
  projectId: string;
  kind: ReleaseKind;
  /** Other folders the app depends on, so their commits count (`packages/web`). */
  extraPaths?: string[];
  configPath?: string;
}

export interface Report {
  projectId: string;
  kind: ReleaseKind;
  branch: string;
  sha: string;
  appPath: string | null;
  paths: string[];
  configErrors: string[];
  tags: string[];
  lastTag: string | null;
  /** The subjects of the commits since the last tag that touch the app. */
  subjects: string[];
  verdict: Verdict;
}

/** Everything the skill checks before a release, read from git and from GitHub. It changes nothing. */
export async function inspect({
  projectId,
  kind,
  extraPaths = [],
  configPath = DEFAULT_CONFIG_PATH,
}: InspectOptions): Promise<Report> {
  gitOrThrow(["fetch", "origin", "--tags", "--quiet"]);

  const branch = branchOf(kind);
  const remoteRef = `origin/${branch}`;

  if (git(["rev-parse", "--verify", "--quiet", remoteRef]).code !== 0) {
    throw new Error(
      `${remoteRef} does not exist: a ${kind === "rc" ? "release candidate" : "final release"} needs the ${branch} branch`,
    );
  }

  const sha = gitOrThrow(["rev-parse", remoteRef]).trim();
  const config = existsSync(configPath)
    ? readReleaseConfig(JSON.parse(readFileSync(configPath, "utf8")))
    : {};
  const configErrors = existsSync(configPath)
    ? validateAppConfig(config, projectId)
    : [`${configPath} does not exist`];
  const appPath = findAppPath(projectId);
  const paths = [...(appPath ? [appPath] : []), ...extraPaths];
  const tags = gitOrThrow(["tag", "-l", `${projectId}-v*`])
    .split("\n")
    .filter(Boolean);
  const last = latestTag(tags, projectId);
  const range = last ? [`${last.tag}..${remoteRef}`] : [remoteRef, "-200"];
  const subjects = gitOrThrow([
    "log",
    "--no-merges",
    "--pretty=%s",
    ...range,
    ...(paths.length > 0 ? ["--", ...paths] : []),
  ])
    .split("\n")
    .filter(Boolean);

  const repo = parseRemote(gitOrThrow(["remote", "get-url", "origin"]));

  if (!repo) {
    throw new Error("the remote origin is not a GitHub repository");
  }

  const token = getToken();
  const base = `/repos/${repo.owner}/${repo.repo}`;
  const pullsResponse = await githubRequest({
    token,
    path: `${base}/commits/${sha}/pulls`,
  });
  const pulls: MergedPull[] = (
    Array.isArray(pullsResponse.json) ? (pullsResponse.json as ApiPull[]) : []
  ).map((pull: ApiPull) => ({
    number: pull.number,
    mergedAt: pull.merged_at ?? null,
    baseRef: pull.base?.ref ?? "",
    headSha: pull.head?.sha ?? "",
  }));
  const mergingPull = pulls.find(
    (pull) => pull.mergedAt !== null && pull.baseRef === branch,
  );

  let checkRuns: CheckRun[] = [];
  let statuses = { state: "pending", total: 0 };

  if (mergingPull) {
    for (let page = 1; ; page++) {
      const response = await githubRequest({
        token,
        path: `${base}/commits/${mergingPull.headSha}/check-runs?per_page=100&page=${page}`,
      });
      const runs = (response.json.check_runs ?? []) as Record<
        string,
        string | null
      >[];

      checkRuns = checkRuns.concat(
        runs.map((run) => ({
          name: String(run.name),
          status: String(run.status),
          conclusion: run.conclusion ?? null,
        })),
      );

      if (runs.length < 100) {
        break;
      }
    }

    const status = await githubRequest({
      token,
      path: `${base}/commits/${mergingPull.headSha}/status`,
    });

    statuses = {
      state: String(status.json.state ?? "pending"),
      total: Number(status.json.total_count ?? 0),
    };
  }

  return {
    projectId,
    kind,
    branch,
    sha,
    appPath,
    paths,
    configErrors,
    tags,
    lastTag: last?.tag ?? null,
    subjects,
    verdict: evaluateChecks({ branch, pulls, checkRuns, statuses }),
  };
}
