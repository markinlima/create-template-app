#!/usr/bin/env bun
// Steps 4 and 5 of the skill: pushes the branch (never a trunk) and opens the pull request.
//
//   bun create-pr.ts --title "..." --body-file body.md [--base dev] [--draft] [--no-push] [--dry-run]
//
// The target comes from the flow (feature -> dev -> staging -> main). `--base` only matters for a hotfix. The token is the one git uses to
// push; it is not printed.

import { readFileSync } from "node:fs";

import { parseArgs } from "./lib/args";
import { getToken, githubRequest, parseRemote } from "./lib/github";
import { git, gitOrThrow } from "./lib/run";
import { checkBase, isTrunk, pickTarget } from "./lib/target";

function fail(...lines: string[]): never {
  console.error(lines.join("\n"));
  process.exit(1);
}

const { flags, values } = parseArgs(process.argv.slice(2), [
  "title",
  "body-file",
  "base",
  "head",
]);
const title = values.get("title");
const bodyFile = values.get("body-file");

if (!title || !bodyFile) {
  fail(
    'usage: bun create-pr.ts --title "..." --body-file body.md [--base dev] [--head branch] [--draft] [--no-push] [--dry-run]',
  );
}

const head =
  values.get("head") || gitOrThrow(["branch", "--show-current"]).trim();

if (!head) {
  fail("HEAD is detached: check out a branch first.");
}

const dirty = gitOrThrow(["status", "--porcelain"]).split("\n").filter(Boolean);

if (dirty.length > 0) {
  fail(
    `The working tree has ${dirty.length} uncommitted changes. Commit them with the commit skill first: a pull request must not leave work behind.`,
  );
}

const remote = git(["ls-remote", "--heads", "origin"]);

if (remote.code !== 0) {
  fail(`Could not read the remote: ${remote.stderr.trim()}`);
}

const remoteTrunks = remote.stdout
  .split("\n")
  .map((line) => line.split("\trefs/heads/")[1])
  .filter((name): name is string => Boolean(name) && isTrunk(name as string));

const requestedBase = values.get("base");
const picked = pickTarget({ branch: head, remoteTrunks });
const base = requestedBase ?? picked.base;

if (!base) {
  fail(picked.reason);
}

const baseErrors = requestedBase
  ? checkBase({ branch: head, base, remoteTrunks })
  : [];

if (baseErrors.length > 0) {
  fail(...baseErrors);
}

const repo = parseRemote(gitOrThrow(["remote", "get-url", "origin"]));

if (!repo) {
  fail("The remote origin is not a GitHub repository.");
}

const body = readFileSync(bodyFile, "utf8");

if (flags.has("dry-run")) {
  console.log(
    `would open: ${repo.owner}/${repo.repo}  ${head} -> ${base}${flags.has("draft") ? " (draft)" : ""}\ntitle: ${title}`,
  );
  process.exit(0);
}

if (isTrunk(head)) {
  console.log(
    `${head} is a trunk: it is not pushed, the pull request is made from what is on the remote`,
  );
} else if (!flags.has("no-push")) {
  // ? A network failure is tried again a few times; a refusal of the remote is not (it would only repeat).
  let pushed = false;

  for (let attempt = 1; attempt <= 3 && !pushed; attempt++) {
    const result = git(["push", "-u", "origin", head]);

    pushed = result.code === 0;

    if (!pushed) {
      const reason = `${result.stderr}${result.stdout}`;

      if (
        /rejected|non-fast-forward|denied|protected/i.test(reason) ||
        attempt === 3
      ) {
        fail(`git push failed:\n${reason.trim()}`);
      }

      await Bun.sleep(2000 * 2 ** (attempt - 1));
    }
  }
}

const token = getToken();
const pulls = `/repos/${repo.owner}/${repo.repo}/pulls`;
const created = await githubRequest({
  token,
  method: "POST",
  path: pulls,
  body: { title, body, head, base, draft: flags.has("draft") },
});

if (created.status === 201) {
  console.log(`${created.json.html_url}\n${head} -> ${base}`);
  process.exit(0);
}

if (created.status === 422) {
  const existing = await githubRequest({
    token,
    path: `${pulls}?state=open&head=${repo.owner}:${head}&base=${base}`,
  });
  const first = Array.isArray(existing.json)
    ? (existing.json[0] as { html_url?: string } | undefined)
    : undefined;

  if (first?.html_url) {
    fail(
      `A pull request for ${head} -> ${base} is already open: ${first.html_url}`,
    );
  }
}

fail(
  `GitHub answered ${created.status}: ${String(created.json.message ?? "no message")}`,
  JSON.stringify(created.json.errors ?? ""),
);
