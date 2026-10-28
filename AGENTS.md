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
templates/web/spa   # React SPA (TanStack Router)        — see templates/web/spa/AGENTS.md
templates/web/mpa   # React MPA (TanStack Start, SSR)    — see templates/web/mpa/AGENTS.md
templates/mobile    # placeholder, not started
templates/backend   # placeholder, not started
templates/dev-container  # .devcontainer + .githooks, copied to the root of a project (README inside)
packages/web/*      # web libs: alert, form, infinite-list, notification, shared, theme, ui
packages/shared/*   # config (tsconfig base), utils, env
```

## Conventions

- **Templates are copied, not published.** Keep them self-contained: a template may depend only on `packages/*` and on npm. No template imports another template.
- **`spa` and `mpa` keep the same structure.** A change to a shared concern (a lib config, a placeholder page, a script) is made in both. Only the setup files differ.
- **Placeholders are marked with `FIXME`** and must stay obviously fake: no product names, texts or assets from real projects.
- Libs in `packages/web` are generic: no API client, routes, env or product code. See each lib's `AGENTS.md`.
- Rules live in `.agents/rules/` (`generic/`, `typescript/`, `web/`). `CLAUDE.md` files contain exactly `@AGENTS.md` and are never edited.
