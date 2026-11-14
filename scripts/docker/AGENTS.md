# Docker scripts — AI Instructions

## What it is

Two entries drive the Docker environment of the repo. The usage for people is in [docs/docker.md](../../docs/docker.md); this file is how the code is organized and what every project must provide.

- `setup.ts` (`bun run script:setup-project`): a menu of the projects in `projects.json` and the extras (monitoring). It creates `development-net`, stops what runs, and runs `docker compose --profile <chosen> up -d` from the root. With nothing selected, it asks to bring every container down.
- `test.ts` (`bun run script:test-project [project|all] [script] [--keep]`): runs the tests of each project that has a `docker-compose.test.yml`, each in its own stack. It builds the test image, starts the stack, waits for `tests-runner`, prints the last 100 log lines on failure, and brings the stack down unless `--keep`.

## Layout

```
projects.json (root)   the projects: id, name, description, path, and the release ids (dokploy, phase) read by CI
scripts/docker/
  setup.ts, test.ts    entries: only compose what is in utils/
  constants/           values: projects (read from projects.json), root dir, test stack names, DNS hint
  types/               shared types, one per file
  utils/docker/        builds or runs a docker command: args, envs, run-compose (the only place that calls `docker compose`), network, down
  utils/terminal/      steps that talk to the user in the terminal (prompts, cancel, stop everything)
  utils/               flow and functional helpers: find the test projects, run the tests of one project
```

- One function per file. Tests sit next to the file they test (`*.test.ts`) and run with `bun run test:scripts`.
- `runCompose` never throws: a failure comes back as the exit code (and stderr when quiet).

## How the pieces connect

- The projects come from `projects.json`. `id` is the Compose profile (`backend`), the test profile is `<id>-test`, and the test network is `<id>-test` too (`DEV_NET`, not external).
- Test stacks set `POSTGRES_DB=app_test`, `TEST_TARGET` (default `test:all`) and `DEV_NET_EXTERNAL=false`, so they never reach the dev services.
- `runAppTests` runs in the project `path`, so an app or a worker works the same way.

## Adding a step

- A command for `docker`: a file in `utils/docker/`, using `runCompose`.
- A question or a step the user sees: a file in `utils/terminal/`.
- Anything else that works on the projects: a file in `utils/`, named for what it does.
- Don't call `docker` directly from the entries; go through `runCompose`.

## Standard of a project

Every app and worker listed in `projects.json` follows this. The scripts rely on it.

### 1. Registration

- One entry in `projects.json` at the root: `id`, `name`, `description`, `path`. A deployed project also has `dokploy` (and `phase.appId` when it needs Phase envs), read by CI.
- `id` is lowercase and unique. It is the Compose profile of the project and the prefix of its test profile and network, so it must match the profile names in the compose files exactly.
- `path` is the folder, relative to the root (`apps/<name>` or `workers/<name>`). The folder holds the project's own files, not the whole stack.
- The root `docker-compose.yml` must `include` the project's `docker-compose.yml` (the scripts don't add it).

### 2. Running it (`docker-compose.yml` in the project folder)

- A service with the profile `<id>`, built from the `production` stage of the project's `dockerfile` with `context: ../../` (the repo root, because the build needs the workspaces).
- Its env comes from `.env` (copied from `.env.example`), never from a file committed with real values.
- Every service it needs (database, cache, queue) is defined once in `docker-compose.services.yml` with the profile `<id>` and `services`, not copied into the project.

### 3. Testing (`docker-compose.test.yml`, optional)

A project with this file shows in the test menu. The file must:

- be named `docker-compose.test.yml` and have `name: <id>-test`;
- `include` `../../docker-compose.services.yml`, so the services come with the profile `<id>-test`;
- declare a `tests-runner` service with the profile `<id>-test`, built from the `test` stage of the dockerfile, with `env_file: .env.test`;
- set `depends_on` the services it needs with `condition: service_healthy`, so the runner starts after they are ready;
- use the `development-net` network with `name: ${DEV_NET:-development-net}` and `external: ${DEV_NET_EXTERNAL:-true}`, because the test stack needs its own network.

The `test` stage of the dockerfile:

- sets `ENV TEST_TARGET="test:all"` as the default;
- runs the migrations first when the project has a database, then `bun run "$TEST_TARGET"` as `CMD`, so the same stage runs any script of the app.

### 4. Scripts (`package.json` of the project)

- `test:all` must exist: it is the default target.
- Use the standard names for the suites: `test:unit`, `test:integration`, `test:e2e`, plus `lint` and `ts:check`. `test:all` runs the suites that exist.

### 5. Environment

- `.env.test` is committed, with test values only; it is what the test stack reads.
- `.env.example` lists the names of the envs of `.env`, with `FIXME` placeholders.
- Never commit a real `.env`.

### Checking a new project

1. `projects.json` has the entry and the `path` exists.
2. `bun run script:setup-project` lists it and starts it with `<id>`.
3. If it has tests: `bun run script:test-project <id>` builds the test image and runs `test:all`.
