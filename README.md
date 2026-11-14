# create-template-app

A monorepo of **templates** to copy and paste into new projects. Nothing here is a product: every page, text and logo is a placeholder (search for `FIXME`) meant to be edited or deleted after the copy.

The templates and the libs live in the same Bun + Turborepo monorepo on purpose: the projects they feed share libs (`@web/*`, `@shared/*`), either inside one monorepo or across repos, so a template copied together with `packages/` keeps working with no changes.

## Structure

```
apps/
  web/         # React SPA: Vite + TanStack Router, served by a Nitro (Bun) server that injects the SEO of each page
  backend/     # REST API: Elysia + OpenAPI contracts + Drizzle on Postgres 18 + Better Auth (e-mail code)
packages/
  web/         # libs for the web apps: ui, form, theme, toast, alert, infinite-list, seo, server, update, analytics, detect-adblock, shared
  backend/     # libs for the backend: db (Drizzle schema, client and migrations)
  shared/      # routes (API contracts), config (tsconfig), utils, env (zod env schemas), authorization
docs/          # token-economy notes for AI agents
.devcontainer/ # Dev Container to copy to the root of a project (see .devcontainer/AGENTS.md)
.githooks/     # git hooks to copy to the root of a project (pre-push blocks direct pushes to trunk branches)
.agents/       # AI rules and skills (AGENTS.md is the source of truth; CLAUDE.md just imports it)
```

The web template lives in `apps/web`. It is a client-only SPA: the browser renders every page. A Nitro server (Bun preset) serves the build from memory, and writes the SEO tags into `index.html`, into the pages that are prerendered and into the pages whose tags come from data.

|              | `apps/web`                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | TanStack Router                                         |
| Entry        | `index.html` + `src/main.tsx`                           |
| Build output | `dist/` (client files + Nitro server in `dist/server/`) |
| Docker       | Bun distroless image running the Nitro server           |

## Getting started

```bash
bun install

cd apps/web
cp .env.example .env
bun run build:prepare  # route tree, image types and the API layer (Kubb), all git-ignored
bun run dev
```

Run `build:prepare` before `ts:check`/`test` on a fresh clone: the generated files are not committed.

## Using a template

1. Copy `apps/web` to `apps/<name>` (or wherever it should live) in the target monorepo.
2. Copy the `packages/` you need and the root files (`package.json` workspaces + `catalog`, `biome.jsonc`, `bunfig.toml`, `turbo.json`, `tsconfig.json`) if the target monorepo doesn't have them yet.
3. Rename the package (`name` in `package.json`, `turbo prune <name>` in the `dockerfile`, the image tag in `docker:build`) and fix the `@source` paths in `src/styles/global.css` and the `docker` paths to the new depth.
4. Search for `FIXME` and replace the placeholders: `src/core/info.ts`, `src/core/routes.ts`, the pages in `src/routes`, the session in `src/modules/auth/utils/get-session.ts`, the logo, `public/`, `openapi.json` (`bun run script:generate-openapi`).

## Root scripts

- `bun run lint` / `lint:fix` — Biome (repo-wide)
- `bun run ts:check` — TypeScript in every workspace
- `bun run test` — tests in every workspace

## Docs

- [docs/token-economy.md](docs/token-economy.md) — how to spend fewer Claude Code tokens (measurements, auto-compact, `/clear` vs `/compact`, subagents). The subagents live in `.agents/agents/`; see [AGENTS.md](AGENTS.md#conventions).
