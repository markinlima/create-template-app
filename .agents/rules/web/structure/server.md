---

paths:

- "apps/web/server/**"
- "apps/web/vite.config.ts"

---

# Server folder

`apps/web/server/` is the Nitro server of the build. It runs on Bun and serves
the static build of the SPA. It is the **only** server code of the app: the
browser code in `src/` never imports from it, and the server never imports from
`src/`. The logic of the server is in `@web/server`; this folder holds what is
specific to the app.

## What goes in it

- **`web-server.config.ts`** — the entry: `defineWebServer({...})` with the
  security headers, the cache rules, the default `Cache-Control` and the `api`
  the server asks. Anything that changes per app goes here.
- **`constants/`** — the values the config uses: the addresses and `Cache-Control`
  values of `cache-rules.ts`, the security headers (`build-security-headers.ts`),
  and `server-env.ts`, the server's copy of the public `VITE_*` values.
- **`utils/`** — small functions the server uses, one per file, with their test
  next to them (for example, `get-frame-ancestor.ts`).
- **`routes/`** — not in the template yet. Create it only for a page whose tags
  come from data (see [seo](./seo.md)); a file there is a `defineHeadRoute`.

## How the build reaches the server

The server is wired in `vite.config.ts`: `webServer({ env, nitro })` from
`@web/server/vite` sets up Nitro (the `bun` preset by default) and the server in
one call; the app gives `serverDir: "./server"`, the output folders and the public
`VITE_*` envs. The app never imports `nitro` itself.
The build serves the files from memory, with their `ETag`, compression and
headers already set, so a request builds nothing. In development the server only
answers the addresses of the app with `index.html`.

The server never renders the content of a page. Its only change to the HTML is the
`<head>`: the routes of `server/routes/` add the tags of their content to the
`index.html` before they send it (see [seo](./seo.md)). The body stays the empty
`<div id="root">` of the SPA.

## Cache and headers

Each kind of file has one rule in `constants/cache-rules.ts`. The first rule
that matches wins:

| Files                                        | Rule                  | Why                                          |
| -------------------------------------------- | --------------------- | -------------------------------------------- |
| `/assets/` (hashed)                          | one year, `immutable` | the name changes with the content            |
| `/images/`, `/videos/`, `/meta/` (`public/`) | one day               | the name stays, the content can change       |
| the service worker scripts                   | `no-cache`            | the browser must check it is the current one |
| `version.json` and the manifest              | `no-cache`            | they tell the app a new build exists         |
| everything else (the HTML)                   | five minutes          | the HTML names the current hashed files      |

- A file of `public/` that is **not** under those folders (`robots.txt`,
  `ads.txt`, `ads/`, `manifest.json`) gets the default rule. Add a rule for it
  in `cache-rules.ts` when its cache matters.
- Security headers are built once, when the server starts, from
  `buildSecurityHeaders`. Errors get them through `res.errHeaders`, not
  `res.headers`: setting `res.headers` on every request slows the server down.
- Envs that change per environment (`VITE_UMAMI_URL`) are read from `process.env`
  when the server starts. The `VITE_*` values the build already has come from
  `serverEnv` (`getServerEnv()` from `@web/server/config`), which the build copies into the bundle from `webServer({ env })`, so the container needs no env of
  its own for them.

## Health check

`/healthz` answers `200` when the build is loaded in memory and `503` with the
reason when it is not. It asks nothing of the API or any other service, on
purpose. The script of the check is `health-check.ts` in `@web/server`; `@web/server/vite`
copies it into the build output, and the image's `HEALTHCHECK` runs it, so the
image needs no `curl` or `wget`.

## Don'ts

- Don't import `src/` code into `server/`, or `server/` code into `src/`.
- Don't put a route of the app in `server/` just to serve a page: the SPA handles
  every page. Only a page with data for its tags needs the server (see [seo](./seo.md)).
- Don't add a `Cache-Control` by hand in a handler; add a rule to `cache-rules.ts`.
- Don't add a dependency for the server without asking first (see
  [library-dependencies](../libraries/library-dependencies.md)).
