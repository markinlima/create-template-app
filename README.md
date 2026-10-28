# create-template-app

A monorepo of **templates** to copy and paste into new projects. Nothing here is a product: every page, text and logo is a placeholder (search for `FIXME`) meant to be edited or deleted after the copy.

The templates and the libs live in the same Bun + Turborepo monorepo on purpose: the projects they feed share libs (`@web/*`, `@shared/*`), either inside one monorepo or across repos, so a template copied together with `packages/` keeps working with no changes.

## Structure

```
templates/
  web/
    spa/       # React SPA: Vite + TanStack Router (client only)
    mpa/       # React MPA: Vite + TanStack Start (SSR) + Nitro
  mobile/      # (soon)
  backend/     # (soon)
  dev-container/  # .devcontainer + .githooks to copy to the root of a project
packages/
  web/         # libs for the web apps: ui, form, theme, notification, alert, infinite-list, shared
  shared/      # libs for any app: config (tsconfig), utils, env (zod env schemas)
.agents/       # AI rules and skills (AGENTS.md is the source of truth; CLAUDE.md just imports it)
```

`spa` and `mpa` have the same project structure and the same placeholder pages on purpose; only the setup differs (entry point, Vite config, router/query client creation, Dockerfile). That keeps moving a project from one to the other cheap.

| | `templates/web/spa` | `templates/web/mpa` |
| --- | --- | --- |
| Framework | TanStack Router | TanStack Start (SSR) |
| Entry | `index.html` + `src/main.tsx` | `src/router.tsx` (`getRouter`) + `src/root-document.tsx` |
| Build output | `dist/` (static) | `build/frontend/` (Nitro server, Bun preset) |
| Docker | nginx serving `dist/` | `oven/bun` distroless running the Nitro server |
| Env | `lib/env/client` | `lib/env/client` + `lib/env/server` |

## Getting started

```bash
bun install

cd templates/web/spa   # or templates/web/mpa
cp .env.example .env
bun run build:prepare  # route tree, image types and the API layer (Kubb), all git-ignored
bun run dev
```

Run `build:prepare` before `ts:check`/`test` on a fresh clone: the generated files are not committed.

## Using a template

1. Copy `templates/web/<spa|mpa>` to `apps/<name>` (or wherever it should live) in the target monorepo.
2. Copy the `packages/` you need and the root files (`package.json` workspaces + `catalog`, `biome.jsonc`, `bunfig.toml`, `turbo.json`, `tsconfig.json`) if the target monorepo doesn't have them yet.
3. Rename the package (`name` in `package.json`, `turbo prune <name>` in the `dockerfile`, the image tag in `docker:build`) and fix the `@source` paths in `src/styles/global.css` and the `docker` paths to the new depth.
4. Search for `FIXME` and replace the placeholders: `src/core/info.ts`, `src/core/routes.ts`, the pages in `src/routes`, the session in `src/modules/auth/utils/get-session.ts`, the logo, `public/`, `openapi.json` (`bun run script:generate-openapi`).

## Root scripts

- `bun run lint` / `lint:fix` — Biome (repo-wide)
- `bun run ts:check` — TypeScript in every workspace
- `bun run test` — tests in every workspace
