#!/usr/bin/env bun
// Step 6 of the skill: publishes the release (it creates the tag on the checked commit and starts the workflow). It checks everything again.
//
//   bun create-release.ts <projectId> --kind rc|final --version X.Y.Z [--paths a,b] [--notes-file notes.md] [--yes]
//
// Without --yes it only shows what it would do. Pass --yes only after the user answered "Sim" to the final question of the skill.
// A release candidate gets the next -rcN of its version by itself. The checks of the pull request must be green: there is no way around it here.

import { readFileSync } from "node:fs";

import { parseArgs } from "./lib/args";
import { getToken, githubRequest, parseRemote } from "./lib/github";
import { inspect } from "./lib/inspect";
import { buildReleaseNotes } from "./lib/notes";
import { gitOrThrow } from "./lib/run";
import { formatTag, nextRc, validateTag } from "./lib/tags";

function fail(...lines: string[]): never {
  console.error(lines.join("\n"));
  process.exit(1);
}

const [projectId, ...rest] = process.argv.slice(2);
const { flags, values } = parseArgs(rest, [
  "kind",
  "version",
  "paths",
  "notes-file",
]);
const kind = values.get("kind");
const version = values.get("version");

if (
  !projectId ||
  (kind !== "rc" && kind !== "final") ||
  !version ||
  !/^\d+\.\d+\.\d+$/.test(version)
) {
  fail(
    "usage: bun create-release.ts <projectId> --kind rc|final --version X.Y.Z [--paths a,b] [--notes-file notes.md] [--yes]",
  );
}

const report = await inspect({
  projectId,
  kind,
  extraPaths: values.get("paths")?.split(",").filter(Boolean),
});
const problems = [...report.configErrors, ...report.verdict.problems];

if (problems.length > 0) {
  fail("Not released:", ...problems.map((problem) => `  - ${problem}`));
}

const tag = formatTag(
  projectId,
  version,
  kind === "rc" ? nextRc(report.tags, projectId, version) : undefined,
);
const tagErrors = validateTag({ tag, kind, existingTags: report.tags });

if (tagErrors.length > 0) {
  fail(
    `The tag ${tag} cannot be used:`,
    ...tagErrors.map((error) => `  - ${error}`),
  );
}

const notesFile = values.get("notes-file");
const notes = notesFile
  ? readFileSync(notesFile, "utf8")
  : buildReleaseNotes(report.subjects);
const summary = [
  `tag: ${tag} (${kind === "rc" ? "pre-release" : "release"})`,
  `from: origin/${report.branch} @ ${report.sha}`,
  `pull request: #${report.verdict.pull?.number}, checks green`,
  `commits: ${report.subjects.length}`,
];

if (!flags.has("yes")) {
  console.log(
    [...summary, "", "Not published (no --yes). Notes:", notes].join("\n"),
  );
  process.exit(0);
}

const repo = parseRemote(gitOrThrow(["remote", "get-url", "origin"]));

if (!repo) {
  fail("The remote origin is not a GitHub repository.");
}

const created = await githubRequest({
  token: getToken(),
  method: "POST",
  path: `/repos/${repo.owner}/${repo.repo}/releases`,
  body: {
    tag_name: tag,
    // ? The SHA that was checked, not the name of the branch, so what is released is exactly what was verified.
    target_commitish: report.sha,
    name: tag,
    body: notes,
    prerelease: kind === "rc",
    draft: false,
    generate_release_notes: false,
  },
});

if (created.status !== 201) {
  fail(
    `GitHub answered ${created.status}: ${String(created.json.message ?? "no message")}`,
  );
}

console.log(
  [
    ...summary,
    `released: ${created.json.html_url}`,
    "The release workflow (tests, build, deploy) was started; this does not say it succeeded.",
  ].join("\n"),
);
