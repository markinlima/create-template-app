#!/usr/bin/env bun
// Steps 1 to 4 of the skill in one call: the app, the branch, the checks of the pull request that merged its latest commit, the tags and the
// versions it could take. It changes nothing, and it asks the remote and GitHub.
//
//   bun release-context.ts <projectId> --kind rc|final [--paths packages/web,packages/shared]
//
// Exit code 2 when the release must not be made (the checks are not all green, no merged pull request, or the app cannot be released).

import { parseArgs } from "./lib/args";
import { inspect } from "./lib/inspect";
import {
  applyBump,
  formatTag,
  formatVersion,
  nextRc,
  parseTag,
  suggestBump,
} from "./lib/tags";

const [projectId, ...rest] = process.argv.slice(2);
const { values } = parseArgs(rest, ["kind", "paths"]);
const kind = values.get("kind");

if (!projectId || (kind !== "rc" && kind !== "final")) {
  console.error(
    "usage: bun release-context.ts <projectId> --kind rc|final [--paths a,b]",
  );
  process.exit(1);
}

const report = await inspect({
  projectId,
  kind,
  extraPaths: values.get("paths")?.split(",").filter(Boolean),
});
const lines = [
  `app: ${report.projectId}${report.appPath ? ` (${report.appPath})` : " (no folder with that package name)"}`,
  `kind: ${kind === "rc" ? "release candidate (pre-release), deploy to staging" : "final release, deploy to production"}`,
  `source: origin/${report.branch} @ ${report.sha.slice(0, 9)} (${report.sha})`,
  `last tag: ${report.lastTag ?? "none"}`,
  `commits since it that touch ${report.paths.join(", ") || "the repository"}: ${report.subjects.length}`,
  ...report.subjects.slice(0, 40).map((subject) => `  ${subject}`),
];

if (report.subjects.length > 40) {
  lines.push(`  ... and ${report.subjects.length - 40} more`);
}

const last = report.lastTag ? parseTag(report.lastTag) : null;
const bump = suggestBump(report.subjects);
const bumped = last ? applyBump(last, bump) : "1.0.0";

lines.push(`suggested bump from the commits: ${bump}`);

if (kind === "rc") {
  const options: string[] = [];

  if (last?.rc !== undefined) {
    options.push(
      formatTag(
        projectId,
        formatVersion(last),
        nextRc(report.tags, projectId, formatVersion(last)),
      ),
    );
  }

  options.push(
    formatTag(projectId, bumped, nextRc(report.tags, projectId, bumped)),
  );
  lines.push(
    `tags it could take: ${[...new Set(options)].join(", ")} (the version is the user's decision)`,
  );
} else {
  const promoted =
    last?.rc !== undefined ? formatTag(projectId, formatVersion(last)) : null;

  lines.push(
    `tags it could take: ${[...new Set([promoted, formatTag(projectId, bumped)].filter(Boolean))].join(", ")} (the version is the user's decision)`,
  );
}

const problems = [...report.configErrors, ...report.verdict.problems];

lines.push(
  report.verdict.pull
    ? `pull request that merged it: #${report.verdict.pull.number} (head ${report.verdict.pull.headSha.slice(0, 9)})`
    : "pull request that merged it: none",
  problems.length === 0
    ? "RESULT: ready, every check is green"
    : "RESULT: DO NOT RELEASE",
  ...problems.map((problem) => `  - ${problem}`),
);

console.log(lines.join("\n"));
process.exit(problems.length === 0 ? 0 : 2);
