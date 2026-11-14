# Web SPA — AI Instructions

## What it is

Template of a React single-page app (client only) built with [Vite](https://vite.dev/) and [TanStack Router](https://tanstack.com/router). It is the only web template.

## Setup specific to the SPA

- `index.html` + `src/main.tsx` are the entry; the `<title>`/description of the first paint live in `index.html`. The browser renders every page; the server never renders the content.
- `vite.config.ts` — `@tanstack/router-plugin` (reads `tsr.config.json`), the PWA (`src/lib/vite/setup-pwa.ts`), the Sentry source maps and the Nitro server. The build goes to `dist/`: the client files in `dist/client/` and the server in `dist/server/`.
- The server is `@web/server` (`server/web-server.config.ts`, Bun preset via Nitro). It serves the build from memory, sets the cache and security headers of each kind of file, and answers `/healthz`.
- SEO: `@web/seo` (`src/lib/seo/seo.ts`) writes the site tags into `index.html` at build. A route with `staticData: { prerender: true, seo }` gets its own `index.html` with its tags, and a route with data gets its tags from a file of `server/routes/` (see the [seo rule](../../.agents/rules/web/structure/seo.md)).
- `@web/update` checks the build: the build writes a build id file and the app asks for a new one, so an old tab knows a new version was published.
- `src/router.tsx` exports `createRouter({ queryClient })`; `src/routes/__root.tsx` renders `<HeadContent />` and the providers.
- `lib/env/client.ts` is the only env (`VITE_*`); use `clientEnv`, never `import.meta.env` directly.
- `lib/axios` and `lib/tanstack-query` are plain browser code (one `QueryClient` for the tab).

## Project structure (`src/`)

The folders of the app (`server/`, `src/`, the global folders and the modules) are described in [folder structure](../../.agents/rules/web/structure/folder-structure.md).

## Useful scripts

Run from this folder:

- `bun run dev` — dev server (regenerates the route tree and image types first)
- `bun run build` / `bun run serve` — production build / preview
- `bun run build:prepare` — generate route tree, image types and the API layer; run it on a fresh clone and in CI
- `bun run ts:check` — TypeScript; `bun run lint` — Biome (run after every change); `bun run test` — `bun test` (unit tests in `src/`, `server/` and `scripts/`); `bun run test:integration` builds the app, starts the server of the build and asks it; `bun run test:all` runs both
- `bun run tool:kubb` — regenerate the API layer; `bun run script:generate-openapi` — pull a fresh `openapi.json` from the backend
- `bun run script:optimize-images` — convert images to WebP and regenerate image types
- `bun run docker:build` — build the production image (from the repo root as context)

## Libs

Base UI components, forms, theme, toasts, alerts, infinite list, analytics, ad blocker detection, the SEO and the server of the build, the update checker and shared hooks/utils come from `packages/web/*` (`@web/*`); each has an `AGENTS.md`. App-specific code stays here; libs stay generic. The rules for the web live in `.agents/rules/web/`.

## Placeholders

Every page, text and asset is a placeholder (`FIXME`). The session (`modules/auth/utils/get-session.ts`) is fake and always logged in, the login form only shows a toast, and `openapi.json` has a single `/healthz` operation.

## Memory

Check `.agents/memory/` before working here (testing setup).
