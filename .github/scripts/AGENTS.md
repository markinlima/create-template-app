# CI scripts — AI Instructions

## What it is

Bun scripts run by the workflows of `../workflows/`. Each file at the root of this folder is one step of a job.

## Layout

```
<step>.ts             entries: one per step, named for it. They compose what is in utils/.
constants/            values, one per file (images, Phase version, branches, file names)
types/                types shared by more than one file, one per file
utils/<concern>/      functions, one per file, grouped by concern:
  github/             Actions: env, outputs, log groups, CiError and the entry wrapper main()
  docker/             running a tool image on the files of the checkout
  scm/                the base commit every "what changed?" question compares against
  workspaces/         reads the workspaces without installing anything
  release/            tag parsing, release config, the release branch check
  phase/              downloads the Phase CLI and exports the build envs
  app-tests/          the apps with a Docker test stack: selection, images, suites
  dokploy/            the deploy request
utils/parse-list.ts   a generic helper, at the root of utils/
```

- One function per file. A test sits next to its file (`<name>.test.ts`) and runs with `bun test`.
- An options type used by one function is exported from that function's file. A type shared by several files goes to `types/`.
- Expected failures throw `CiError`. `main()` prints them as `::error::` and exits with 1.

## Adding a step

1. Write the logic in `utils/<concern>/`, with its test.
2. Add the entry at the root of this folder. It only reads the environment and calls utils.
3. Point the workflow at it (`bun .github/scripts/<entry>.ts`).
4. Run `bun run ci:check` from the root.
