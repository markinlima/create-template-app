# Docker environments

Three environments, all driven by Docker Compose profiles. Every command runs from the repo root unless it says otherwise.

## 1. The dev container

`.devcontainer/` is the environment you code in (see its `AGENTS.md`). It joins the `development-net` network, so the services of environment 2 are reachable by name (`postgres`) from inside it. The `initialize` hook creates the network.

## 2. The project environment (production-like, local)

The root `docker-compose.yml` includes the services and the compose of every app. Each app has its own `docker-compose.yml` (a `build` of the `production` stage of its `dockerfile`, under a profile named for the app), and the services are in `docker-compose.services.yml`.

```bash
bun run script:setup-project   # pick what to start: Backend, Web, Monitoring
```

The script creates `development-net`, stops what was running, and runs `docker compose --profile <chosen> up -d`. Nothing is started without a profile.

- **Profiles**: `backend`, `web`, `services` (all the services), `monitoring` (OpenObserve and Rustrak, only to look at telemetry and errors; no test and no app depends on them).
- **A service of the project** goes in `docker-compose.services.yml` with the profile of each app that needs it plus `services`.
- **An app** needs its `.env` (copy `.env.example`); the compose reads it.
- **To publish a port to the host**, use `.devcontainer/docker-compose.local.yml` (not versioned) or `ports` in a local override.
- `bun run script:clear-project` removes `node_modules`, `dist` and `build` from every workspace.

## 3. The test environment

Tests run in Docker so each app brings its own system dependencies. Every app with tests has a `docker-compose.test.yml` that includes the services and runs one `tests-runner` (the `test` stage of its `dockerfile`) in a **network and stack of its own**, apart from the dev stack: on the shared network it would meet the services of the dev stack, which have the same names.

```bash
bun run script:test-project                         # pick the app (or all) from a menu
bun run script:test-project backend                 # the whole suite (test:all) of one app
bun run script:test-project web test:unit           # one script of the app
bun run script:test-project all test:e2e --keep     # every app; --keep leaves the stack up
cd apps/web && bun run docker:test test:integration # the same, from inside an app
```

- The script of the app (`test:all` by default) is any script of its `package.json`: `test:unit`, `test:integration`, `test:e2e`, `lint`, `ts:check`.
- Every run builds the test image, starts the stack, waits for the `tests-runner`, shows the last 100 log lines when it fails, and brings the stack down. The exit code is the one of the runner.
- The runner reads `.env.test` of the app (committed, test values only). The services start with the database `app_test`, and the backend applies its migrations before the suite.
- A service a test stack needs lists the profile of the app in `docker-compose.services.yml` (`backend-test`), so the script only turns on `<app>-test`.

## The projects

`projects.json` at the root lists every project that the scripts and CI know: each one has an `id` (its Compose profile, the prefix of its test profile and of its test network), a `name` and `description` for the menus, and a `path` to its folder (`apps/backend`, `workers/<name>`). The folder is the only place that says whether a project is an app or a worker.

A deployed project also has its release ids in the same entry: `dokploy` (the Dokploy compose id per environment) and, when it needs Phase envs at build time, `phase.appId`. CI reads them to release the project; the scripts ignore them.

```json
{
  "id": "backend",
  "name": "Backend",
  "description": "Servidor da API",
  "path": "apps/backend",
  "dokploy": { "production": "FIXME_DOKPLOY_BACKEND_PRODUCTION", "staging": "FIXME_DOKPLOY_BACKEND_STAGING" }
}
```

- **A new project**: add its entry to `projects.json`, its `docker-compose.yml` (with the profile of its `id`) and its `include` in the root `docker-compose.yml`. The test compose (`docker-compose.test.yml`) is optional: a project with one shows in the test menu.
- The setup menu lists every entry; the test script lists the entries whose folder has a test compose file.
- CI reads the same file (for example, `jq -c '.projects' projects.json` as the input of a matrix).

## The scripts

Both live in `scripts/docker/`, a small `src` with `constants/`, `types/` and `utils/`, one function per file. `setup.ts` and `test.ts` are the entries; they only compose what is in `utils/`. The helpers that build or run a `docker` command are in `utils/docker/` (`runCompose` is the one place that calls `docker compose`). `bun run test:scripts` runs their tests.
