#!/usr/bin/env bun
// Step 1 and 2 of the skill: where you are, which trunk the pull request goes to and what it carries. Read-only (it does ask the remote
// which branches exist).
//
//   bun pr-context.ts [--base <trunk>]

import { existsSync } from "node:fs";

import { parseArgs } from "./lib/args";
import { git, gitOrThrow } from "./lib/run";
import { checkBase, isTrunk, pickTarget } from "./lib/target";

const { values } = parseArgs(process.argv.slice(2), ["base"]);
const branch = gitOrThrow(["branch", "--show-current"]).trim();

if (!branch) {
  console.error("HEAD is detached: check out a branch first.");
  process.exit(1);
}

const dirty = gitOrThrow(["status", "--porcelain"]).split("\n").filter(Boolean);
const remote = git(["ls-remote", "--heads", "origin"]);

if (remote.code !== 0) {
  console.error(`Could not read the remote: ${remote.stderr.trim()}`);
  process.exit(1);
}

const remoteBranches = remote.stdout
  .split("\n")
  .map((line) => line.split("\trefs/heads/")[1])
  .filter((name): name is string => Boolean(name));
const remoteTrunks = remoteBranches.filter(isTrunk);

const picked = pickTarget({ branch, remoteTrunks });
const requested = values.get("base");
const base = requested ?? picked.base;
const errors = requested
  ? checkBase({ branch, base: requested, remoteTrunks })
  : [];

const lines = [
  `branch: ${branch}${isTrunk(branch) ? " (a trunk: it is promoted, not pushed)" : ""}`,
  `remote trunks: ${remoteTrunks.join(", ") || "none"}`,
  `pushed: ${remoteBranches.includes(branch) ? "yes" : "no"}`,
  `working tree: ${dirty.length === 0 ? "clean" : `${dirty.length} uncommitted changes: stop and use the commit skill first`}`,
  `target: ${base ?? "none"} (${requested ? "asked" : picked.reason})`,
  ...errors.map((error) => `ERROR: ${error}`),
];

if (base) {
  const range = `origin/${base}..${isTrunk(branch) ? `origin/${branch}` : "HEAD"}`;
  const commits = gitOrThrow(["log", "--oneline", range])
    .split("\n")
    .filter(Boolean);
  const stat = git([
    "diff",
    "--shortstat",
    range.replace("..", "..."),
  ]).stdout.trim();

  lines.push(
    `commits in ${range}: ${commits.length}`,
    ...commits.slice(0, 60).map((line) => `  ${line}`),
  );

  if (commits.length > 60) {
    lines.push(`  ... and ${commits.length - 60} more`);
  }

  if (stat) {
    lines.push(`changes: ${stat}`);
  }
}

const templates = [
  ".github/pull_request_template.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/PULL_REQUEST_TEMPLATE",
  "docs/pull_request_template.md",
].filter(existsSync);

lines.push(
  templates.length > 0
    ? `PR template: ${templates.join(", ")}`
    : "PR template: none (write a summary and a test plan)",
);
console.log(lines.join("\n"));
