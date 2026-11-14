# Lint and test the changed workspace

Run the checks yourself, inline, after changing code in a workspace and before
asking to commit. This replaces the former `linting-test` subagent: a check
prints a little, and a subagent's startup cost is larger than its output (see
[subagents](./subagents.md) and [token economy](../../../docs/token-economy.md)).

## Scope

1. Find what changed: `git status --short` and `git diff --name-only` (plus the
   base branch diff when the user says so). Map each file to its workspace (the
   nearest directory with a `package.json`). If the user names a workspace, use
   that one.
2. Read only that workspace's `AGENTS.md` and `.agents/memory/testing.md`. Do not
   read other workspaces' memory or unrelated rules.
3. If `testing.md` is missing, or its tasks no longer match the `package.json`
   `scripts`, refresh it first (see below).

## Order (cheapest first)

Use the workspace's own tasks, from `testing.md` and `scripts`:

1. `lint`
2. `ts:check`
3. `test:unit` (or `test`)
4. `test:integration`, `test:e2e`, `build` and extra suites only when the user
   asks, or the change touches what they cover and their prerequisites already
   run.

Run each task through `turbo run <task> --filter=<package>` from the root, or
through the workspace script, with the package manager the repo uses.

## Keep the output small

- Filter the output in the same command, for example
  `bun run lint 2>&1 | tail -40` or `... | grep -n -i -E 'error|fail' | head -40`.
  Keep raw logs out of the conversation.
- On a failure, re-run only the failing file or test once to get the exact error.
- Never run watch modes. Never install dependencies, start services, or change
  files other than `testing.md`. If something is missing, report it instead of
  fixing it.
- Tests run with `.env.test`. Never read `.env` or other real env files.

## Report

A short table: command, workspace, result (pass or fail), duration. For each
failure: `path:line`, the error (max 10 lines) and a one-line probable cause. If
everything passes, one line. List anything you could not run and why.

## Testing memory

Maintain `.agents/memory/testing.md` as described in [testing](../global/testing.md) and
[memory](./memory.md). Create or refresh it when it is missing or stale. Keep
only what the baseline does not already say. Mention it in the report when you
create or change it.
