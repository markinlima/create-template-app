# Releases

How to cut a release in any repo. The rule has two layers, the same idea as
[testing](../global/testing.md):

- **The baseline (this file):** [Semantic Versioning 2.0.0](https://semver.org/)
  plus the branch and safety rules of this repo. It is the same everywhere.
- **The project memory:** `.agents/memory/releases.md`, which records how
  _this_ project names tags, where the version lives and what the pipeline does.
  It differs per repo (`1.2.3` in a single-package repo, `<projectId>-v1.2.3-rc1`
  in a monorepo), so it is **discovered from the repo, never assumed**.

Branches and pull requests are in [branch-workflow.md](./branch-workflow.md);
this file starts where the code is already merged into a trunk.

## Before any release: read or build the memory

1. Read `.agents/memory/releases.md` (at the root, or in the app's own
   `.agents/memory/` for a releasable app of a monorepo).
2. If it is missing, or stale (the workflows, release config or tag history it
   describes changed), **create or refresh it first**, as described below, and
   tell the user you did. Then continue.
3. Never guess a tag format from this file or from another repo. The memory
   wins over any example here.

## Building the memory

Look at how releases are really made, in this order, and stop when it is clear:

1. **Workflows**: `.github/workflows/*` (or the CI of the host in use). Look for
   `on.push.tags`, `on.release`, `workflow_dispatch` inputs, tag regexes,
   branch checks, and what runs after the tag: tests, build, image push, deploy,
   publish to a registry.
2. **Release tooling and config**: `release-please`, `changesets`,
   `semantic-release`, `.releaserc`, `release-*.json`, `CHANGELOG.md`, scripts
   under `.github/scripts` or `scripts/`.
3. **History**: `git tag --list --sort=-v:refname | head -20` and
   `gh release list --limit 10`. The real tags show the format the pipeline
   actually accepts. Compare them with what the workflows say; report any drift.
4. **Where the version lives**: `package.json` `version`, `Cargo.toml`,
   `pyproject.toml`, a `VERSION` file, image tags in the dockerfile or compose.
5. **Project-specific docs**: `docs/ci.md`, `README`, `AGENTS.md`.

If there are no workflows, tags or tooling, record that: "no release process
defined yet", plus the format proposed to the user and approved by them (ask,
do not pick a format on your own).

### What the memory records

Keep it short, in English, one line per item when possible:

- **Versioning scope**: one version for the repo, or one per app/package
  (monorepo), and what the `projectId` is when there is one.
- **Tag format**: the exact pattern for a final release and for a pre-release,
  with a regex or a real example from the tag history.
- **Pre-release convention**: the suffix used (`-rc1`, `-rc.1`, `-beta.2`) and
  which branch it comes from.
- **Where the version is stored** and who bumps it (a person, a tool, the
  pipeline).
- **Which branches can be released**, and the checks that must be green.
- **How the release is created**: by hand on GitHub, by a workflow, by a tool.
- **What the pipeline does** after the tag, in order, and which environment each
  kind of release deploys to.
- **Artifacts**: image tags (fixed and floating), packages, changelog.
- **Config files** a new releasable app needs, if any.
- **Known gotchas** and anything an agent cannot infer from the baseline.

## The baseline: Semantic Versioning 2.0.0

Version format `MAJOR.MINOR.PATCH`, non-negative integers, no leading zeros.

- **PATCH**: backward-compatible bug fixes.
- **MINOR**: backward-compatible new functionality; deprecating public API;
  substantial internal improvements may also bump it. Reset PATCH to 0.
- **MAJOR**: backward-incompatible changes to the public API. Reset MINOR and
  PATCH to 0.
- **`0.y.z` is initial development**: anything may change. `1.0.0` defines the
  public API; from then on the rules above are strict.
- **A released version is immutable.** Never change the contents of a version
  that is out; ship a new one. To retract a bad release, release a fixed
  version, and yank or deprecate the old one if the registry allows it.
- **Pre-release**: a hyphen and dot-separated identifiers after the patch
  (`1.0.0-rc.1`, `1.0.0-beta.2`). It has lower precedence than the same version
  without the suffix (`1.0.0-rc.1 < 1.0.0`). Identifiers are compared one by
  one: numeric ones as numbers, the others in ASCII order. A suffix such as
  `rc10` is one alphanumeric identifier, so it sorts **before** `rc2`; use the
  dotted form (`rc.10`) when the project is free to choose and ordering matters.
- **Build metadata**: a plus sign after the version (`1.0.0+20260101`). It is
  ignored when comparing versions, so never use it to tell two releases apart.
- Precedence is compared on `MAJOR.MINOR.PATCH` numerically, left to right.

A project may wrap this in a prefix (`v`, `<projectId>-v`) or write the
pre-release its own way; the memory says how. The numbers still follow the rules
above.

### Choosing the next version

Take the last release tag of the same scope (`git tag --list` with the memory's
pattern, sorted by version), read the commits since it, and propose a bump
following [Conventional Commits](./commits.md):

| Commits since the last release                          | Bump                                               |
| ------------------------------------------------------- | -------------------------------------------------- |
| any `BREAKING CHANGE:` footer or `!`                    | MAJOR (MINOR while on `0.y.z`, if the user agrees) |
| at least one `feat`                                     | MINOR                                              |
| only `fix`, `perf` and similar                          | PATCH                                              |
| only `docs`, `chore`, `ci`, `test`, `style`, `refactor` | usually no release                                 |

It is a proposal: the user confirms the version. In a monorepo, only the commits
that touch the app (and the workspaces it depends on) count for that app.

## Safety rules

- **Create a release only from the branches the memory allows** (normally
  `main` for a final release and `staging`, if it exists, for a pre-release,
  per [branch-workflow.md](./branch-workflow.md)). Never from a feature branch.
- **Only when everything is green.** Check the pull request that merged the
  latest commit of that branch, at its head commit: failing, pending or missing
  checks mean no release.
- **A release publishes and may deploy.** As an AI agent, never create one on
  your own. Do it only when the user explicitly asks, after confirming the
  branch, the version, the tag and the checks with them, every time.
- Never move, delete or re-create a published tag. If the tag is wrong, release
  a new version.
- Don't use a final tag on a pre-release branch, or a pre-release suffix on a
  final one, unless the memory says that is the convention.

## Keeping it current

When a change alters the release flow (a workflow, the release config, the tag
pattern, the versioning scope), update `.agents/memory/releases.md` in the same
change. See [memory](../ai/memory.md).
