# Testing in a monorepo

Every workspace (app or package, any language) is tested the same way from the
outside, so agents never guess commands. What differs per workspace is recorded
in a memory file, not hardcoded in rules or agents.

## The baseline

- Turborepo is the entry point. Every workspace has a `package.json` whose
  `scripts` wrap the real tool, whatever the language. Tasks are run as
  `turbo run <task> --filter=<package>` from the root, or the script from
  inside the workspace.
- Standard task names, in this order, cheapest first: `lint`, `ts:check`
  (type-check), `test:unit`, `test:integration`, `test:e2e`, `build`. `test`
  is the default suite (usually unit). A workspace only defines the ones it has.
- Always read the workspace's `package.json` `scripts` — never assume a task
  exists or what it runs.

## After every code change

- Run `lint` in the workspace you changed before considering the change done.
  Run it from inside that workspace or with `turbo run lint --filter=<package>`.
- Run that workspace's unit tests (`test:unit`, or `test` when it is the unit
  suite) whenever the change can affect behavior. When in doubt, run them.
- Run the other suites (`test:integration`, `test:e2e`, `build`) only when the
  change touches what they cover.

## Test environment

- Tests use `.env.test`: values made only for tests, committed on purpose, no
  real secrets. It must work unchanged on a dev machine and in CI.
- Never read `.env`, `.env.local` or other real env files (see
  [sensitive-files](../ai/sensitive-files.md)). `.env.test` and `.env.example` are fine.
- A workspace needing something in `.env.test` to run (a database, a service)
  documents it in its memory file.

## Per-workspace testing memory

Each workspace keeps `.agents/memory/testing.md` (see [memory](../ai/memory.md))
describing only what an agent cannot infer from the baseline:

- the tasks it defines and what each one runs (one line each);
- anything outside the baseline: extra tools (browser runners, load tests,
  contract checks), non-standard script names, other languages' runners;
- prerequisites: services that must be running, migrations, generated files
  (`build:prepare`), how `.env.test` is loaded;
- known slow, flaky or order-dependent suites.

Workspaces that follow the baseline fully get a three-line file saying so.
Keep it short and in English; update it when the testing setup changes.

## Who maintains it

The agent that runs the checks creates or refreshes the file when it is missing
or stale (its scripts changed), following [lint-and-test](../ai/lint-and-test.md).
Humans and other agents update it when they change how a workspace is tested.
