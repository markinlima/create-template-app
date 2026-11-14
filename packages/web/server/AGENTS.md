# @web/server — AI Instructions

## What it is

The web server of a web app, as a library: a small Bun server built with [Nitro](https://nitro.build) that serves the static
build of a SPA (files from memory, brotli/gzip, `ETag`/`304`, cache and security headers, the SPA fallback) and answers the pages whose
tags come from data. It was written for `apps/web` and is meant to be used by every web project: the logic is here, what changes from app
to app is the config and the routes of the app.

It has three entries:

- `@web/server/vite` — `webServer({ nitro })`, which gives `nitro()` with the defaults of the server (the Bun preset, no static serving by
  Nitro, no renderer) and then `webServerModule()`, a Vite plugin that is also a Nitro module (it has a `nitro` key). The two stay separate
  plugins: `webServerModule()` can be used alone next to the app's own `nitro()`. The module adds the handlers and the plugin of the server and
  hands them the config of the app.
- `@web/server/config` — `defineWebServer` and `getServerEnv`, for the config of the app and its `server/` code. It is its own entry because the main one reads that config (the routes with data need
  it): a config that imports the main entry makes the two import each other, which breaks in development.
- `@web/server` — what the app imports in its `server/` folder: `defineWebServer` (the config), `defineHeadRoute` (a page with data) and
  `getShell` (the `index.html` of the build, for a handler of the app that needs it).

## Main technologies

- [Nitro](https://nitro.build) 3 (handlers, plugins, modules and virtual modules), running on the Bun preset
- [`@web/seo/head`](../seo/AGENTS.md) for the tags (`injectHead`) and [Zod](https://zod.dev/) for the params and the answers of the API
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests; TypeScript (strict)

## Useful scripts

Run from `packages/web/server`:

- `bun run test` — run the `bun test` suite (every `*.test.ts`)
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run ts:check` — TypeScript type-check only

## How it works

- The app spreads `webServer({ nitro: {...} })` into the plugins of its Vite config, giving its own Nitro options (`serverDir`, `output`, `compressPublicAssets`, and `renderer` in `vite dev`, where there is no build and Nitro answers the app addresses with `index.html`). The options of the app go over the defaults, an `undefined` keeps the default. `webServer({ env })` copies public envs (e.g. `VITE_API_URL`) into the server bundle through the Nitro `runtimeConfig`, and the app reads them with `getServerEnv()`: the app never imports `nitro` itself. The module registers three handlers on `/**` (the security headers of
  the errors, the files, and the SPA fallback, in this order), a plugin that starts reading the build with the server, and a virtual module
  (`#web-server/runtime`) made while Nitro bundles: the config of the app (the default export of the config file in its `server/` folder) and the folder
  of the client from the folder of the server. A route of the app in `server/routes` is more specific than `/**`, so it wins.
- **The config** (`WebServerConfig`) has a default for everything: `securityHeaders` (an object, or a function run once when the server
  starts, so one image serves every environment), `cacheRules` (the first that matches wins; a string is the start of the address, a regular
  expression is tested against all of it) and `defaultCacheControl`, `notFoundPrefixes` (a missing file under them is a `404` with `no-store`,
  not the shell), `preloadMaxBytes` (a bigger file is streamed from the disk), `spaFallback` and `api` (for `defineHeadRoute`).
- **Files**: the whole build is read into memory at start; every variant (raw, gzip, brotli) has its own `ETag` and carries the security
  headers and the `Cache-Control` already, so a request builds nothing. The compressed copies are the ones Nitro wrote at build (`.gz`,
  `.br`); the server never compresses.
- **Security headers on errors**: only through `res.errHeaders`. Setting `res.headers` on every request makes h3 rebuild every response
  to merge them, which cost about a seventh of the throughput in the local benchmark that led to this design (not in the repository).
- **`defineHeadRoute({ params, load, tags })`**: the file of the app in `server/routes/` with the shape of the address is its default
  export. It checks the params with a Zod schema, calls `load` (which asks the API through `api.get(path, schema)`), builds the tags and
  puts them into the shell with `injectHead`. With nothing to show (params that do not pass, `load` gives `null` or fails, the API is down) the
  page is the shell with a `noindex` tag, status `200`, never cached: the app shows its own message. A failure of `load` is logged and never
  reaches the visitor. A page is not indexable unless the route says `indexable: true`; the browser keeps a page with content
  for an hour unless it says another `cacheControl`.
- **Health check**: `/healthz` (the `health` handler) answers `200 ok` when the build is loaded in memory with its `index.html`, `503` with the
  reason when not, and asks nothing of the API or any other service on purpose. the script in `scripts/` is what the `HEALTHCHECK` of the image
  runs (no shell, `wget` or `curl` needed, so it works in a distroless Bun image): the module copies it, alone and with
  no imports, to the output folder when the build ends. The static-files handler lets `/healthz` pass so a broken build says `503`, not `500`.
- The module turns off the `immutable` rule Nitro puts on the folder of the hashed files: it would also cover the `404` of an old hash,
  and a cache could keep that for a year.

## Folders

All under `src/`, laid out by [the web lib structure rule](../../../.agents/rules/web/libraries/web-lib-structure.md); one function per
file, with its `*.test.ts` next to it.

- `handlers/` and `plugins/` — the Nitro handlers and plugin the module registers. They only call functions; the logic is in `utils/`.
- `scripts/` — files the build copies into the output to run on their own, outside the server (the health check). No imports.
- `lib/` — what needs the running server: the config and the build read once (`get-resolved-config`, `get-public-files`), the API client
  and the shell. Only one file of `lib/` imports the virtual module.
- `utils/` — pure functions, grouped by concern: `files/` (loading the build, choosing the variant, `ETag`, cache rule, the response of a
  file), `head-route/` (the API client, the page with tags, the response of a route), `health/` and `config/` (the defaults).
- `types/`, `constants/` — the config types and the defaults. `vite/` — the `@web/server/vite` entry: `webServer`, the module, and its own `constants/`, `types/` and `utils/`.

## Don'ts

- Don't import `lib/` from a test: it needs the Nitro bundle (the virtual module). Test the function in `utils/` it calls.
- Don't set headers on every request through `res.headers` (see above).
- Don't read the build from the disk on a request; add the file to what `loadPublicFiles` reads at start.
- Don't compress at run time; the copies are made at build.
- Dependencies: the libraries the project already uses; a new one is asked first, see
  [`.agents/rules/web/libraries/library-dependencies.md`](../../../.agents/rules/web/libraries/library-dependencies.md).

## Memory

Check `.agents/memory/` before working here (testing setup).
