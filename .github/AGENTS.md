# .github — AI Instructions

## What it is

The CI/CD of the repo: GitHub Actions workflows, the setup composite action, Dependabot, and the Bun scripts the workflows run.
It is copied to the root of a project with the other root-level files (`.githooks`, `.devcontainer`).

## Layout

```
workflows/            on-push and on-pull-request (CI), release (by tag), reuse-* (reusable jobs called by the others)
actions/setup/        composite action: installs Bun (the version of the root package.json) and, optionally, the dependencies
scripts/              the Bun scripts the workflows run — see scripts/AGENTS.md
(no release file: the release ids live in the root projects.json, next to each project)
act/                  event payload to run the workflows locally with act (`bun run ci:act`)
dependabot.yml        keeps the SHA-pinned actions up to date
```

## Conventions

- Every action is pinned by commit SHA, with its version in a comment (`# v7.0.1`). Dependabot updates them.
- The release ids in the root `projects.json` hold `REPLACE_ME` placeholders in the template. A release fails while one is left, on purpose.
- CI reads `projects.json` at the root of the repo, so this folder depends on it: copy them together.
- The workflows only call scripts by path (`bun .github/scripts/<entry>.ts`). A rename of a script means changing the workflow too.
- Root scripts: `bun run ci:lint` (actionlint, native) and `bun run ci:check` (type-check and tests of `scripts/`).
