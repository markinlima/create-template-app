# AGENTS.md

## What it is

Root-level AI agent instructions for the `create-template-app` monorepo: a collection of project templates (copy and paste) and the libs they share. **Each template and package has its own `AGENTS.md`** — read the relevant one before working inside it; it takes precedence over this file for anything local.

## Main technologies

- **Monorepo**: Turborepo
- **Package manager / runtime**: Bun
- **Language**: TypeScript (strict)
- **Lint / format**: Biome

## Useful scripts

Run from the repo root:

- `bun run lint` / `bun run lint:fix` — Biome check (repo-wide)
- `bun run ts:check` — TypeScript type-check across every workspace
- `bun run test` — tests across every workspace

Scope any of them with `turbo run <task> --filter=<package>`.

## Monorepo structure

```
apps/web            # React SPA (TanStack Router) served by Nitro — see apps/web/AGENTS.md
apps/backend        # REST API (Elysia, Drizzle, Better Auth) — see apps/backend/AGENTS.md
packages/web/*      # web libs: alert, analytics, detect-adblock, form, infinite-list, seo, server, shared, theme, toast, ui, update
packages/backend/*  # backend libs: db (Drizzle schema, client, migrations)
packages/shared/*   # routes (API contracts, OpenAPI models), config (tsconfig base), utils, env, authorization
docker-compose*.yml # the project environment: the services and the compose of each app, run by profiles (see docs/docker.md)
projects.json       # the projects (apps and workers): id, name, description, folder and release ids (see docs/docker.md)
scripts/            # setup-project (starts the Docker environment), clear, and qa-chrome (Chrome with remote debugging for the chrome-devtools MCP, run on the host)
.devcontainer       # Dev Container (image, compose, hooks, features), copied to the root of a project — see .devcontainer/AGENTS.md
.githooks           # git hooks (pre-push blocks direct pushes to trunk branches), copied to the root of a project
.github             # CI: workflows, the setup action and the CI scripts (Bun) — see .github/AGENTS.md
```

## Conventions

- **Templates are copied, not published.** Keep them self-contained: a template may depend only on `packages/*` and on npm. No template imports another template.
- **One web template: `apps/web`.** A client-only SPA: the browser renders every page, and a Nitro server (Bun preset) serves the build.
- **Placeholders are marked with `FIXME`** and must stay obviously fake: no product names, texts or assets from real projects.
- Libs in `packages/web` are generic: no API client, routes, env or product code. See each lib's `AGENTS.md`.
- Rules live in `.agents/rules/` (`ai/`, `backend/`, `doc/`, `git/`, `global/`, `typescript/`, `react/`, `web/`). `CLAUDE.md` files contain exactly `@AGENTS.md` and are never edited.
- Status line: the `statusline` skill installs `.agents/scripts/statusline.sh`.
- Testing is baseline-plus-memory: see `.agents/rules/global/testing.md` and each workspace's `.agents/memory/testing.md`.
- Subagents live in `.agents/agents/`; `.agents/settings.json` holds the shared Claude Code settings (auto-compact window). When to use each is in `.agents/rules/ai/subagents.md`.

## Docs

- [docs/docker.md](docs/docker.md) — the three Docker environments (dev container, project, tests), their profiles and scripts.
- [docs/token-economy.md](docs/token-economy.md) — how to spend fewer Claude Code tokens: what was measured, auto-compact, `/clear` vs `/compact`, subagents, and when to re-evaluate (`docs/token-economy-usage.py` re-measures).
