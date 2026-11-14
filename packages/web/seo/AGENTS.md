# @web/seo — AI Instructions

## What it is

The SEO of a web app, as a library, with three entries:

- `@web/seo` — the runtime of the site: `createSeo(site)` says what the site and each page say (the defaults, the tags a page changes) and
  `removeSeoHeadTags` removes the tags the build or the server wrote. The browser bundles it.
- `@web/seo/head` — the tags of a head as pure functions: build them from what a page says (`buildMeta`), put them together (`mergeMeta`),
  write them as HTML (`renderHeadTags`) and put them into the HTML of a page (`injectHead`), replacing the tags it already has. The web
  server uses it for the link previews of the pages with data (shared posts, collections and profiles).
- `@web/seo/vite` — a Vite plugin: after `vite build` it writes the tags of the site into `index.html` and an `index.html` per route that
  asks for it with `staticData: { prerender: true, seo }`, so crawlers that don't run JavaScript read the tags.

## Main technologies

- [Vite](https://vite.dev/) plugin API; `parseSync` of Vite (the parser of the route files, which are read and never run)
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/seo`:

- `bun run test` — run the `bun test` suite (every `*.test.ts`)
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run ts:check` — TypeScript type-check only

## How it works

- `buildMeta` is generic: every option is one thing a page says, and it is written to every tag that carries it (`title` → `<title>`,
  `og:title`, `twitter:title`; the same for `description`, `url` and `image`). A tag is only written when its value is given. There is no
  per-network text on purpose: it changes little in a preview and would triple what each page has to say.
- `injectHead` takes out the tags of the same title, name, property or rel before adding, so no tag appears twice. Every tag written
  carries `SEO_TAG_ATTRIBUTE`, which the web app uses to take them out when it boots.
- Every value goes through `escapeHtml` before it reaches the HTML (the content of a post is written by users). Never build a tag by hand.
- `createSeo(site)` binds the site (name, title, description, keywords, image, locale) to the pages' functions. The app calls it once.
- The plugin reads each route file with `parseSync` and reads the whole `staticData` of the `Route`, which has to be literal values, and checks it with a Zod schema (`prerender` a boolean, `seo` with a title). Only `prerender: true` writes a page (a route with `seo` and no `prerender` has the tags in the browser only); it needs a `seo` with a title and an address without parameters, and the build fails otherwise. A page with `noIndex` is written but left out of the `sitemap.xml`. A value that needs code (a
  call, a variable, an `as const`) fails the build, naming the node, so a page is never written from a guess.
- The address of a page is the route path without the pathless groups (`_landing-pages`, `_redirect`) and the slash.
- The plugin writes the pages with `injectHead`, so a tag the `index.html` already had is replaced, never doubled.
- Pages with data are not written at build time: the web server answers them with `@web/seo/head`.

## Folders

All under `src/`, laid out by [the web lib structure rule](../../../.agents/rules/web/libraries/web-lib-structure.md); one function per
file, named after the function in kebab-case, with its `*.test.ts` next to it.

- The root of `src/` is the runtime entry (`@web/seo`): `index.ts`, the `createSeo` file, `utils/` (the default and per-page meta, the HTML of
  a static page, the removal of the tags), `types/` and `test/` (the `site` fixture only tests use).
- `head/` the `@web/seo/head` entry: its own `index.ts`, `utils/` grouped by concern (`build/` build, merge, key and removal of existing
  tags; `render/` the tags as HTML and their injection; `strings/` escaping), `types/` and `constants/`.
- `vite/` the `@web/seo/vite` entry: `index.ts`, the plugin and the prerender of the static pages at its root, and `utils/` (the
  `sitemap.xml` and `read-routes/`, the files that read the route files).

To add a function, put it in the folder of its theme, add its test beside it and export it from that entry's `index.ts` only if
consumers need it.

## Don'ts

- Don't import `vite` from the runtime entry or from `head/`: the browser and the web server bundle them.
- Don't import `vite/` from `head/` or the runtime root.
- `head/` must run anywhere (Bun, Node, the browser): no DOM and no I/O. What touches the DOM lives in the runtime root.
- Don't run route files to read their SEO; add the data as a literal in `staticData.seo`; a title worked out from params or data goes in the route's `head` instead.
- Don't write a tag by hand: add the option to `buildMeta`.
- Dependencies: it may use the libraries the project already uses (Zustand, Zod...); a new one is asked first, see
  [`.agents/rules/web/libraries/library-dependencies.md`](../../../.agents/rules/web/libraries/library-dependencies.md).
- Structure: see [`.agents/rules/web/libraries/web-lib-structure.md`](../../../.agents/rules/web/libraries/web-lib-structure.md).

## Memory

Check `.agents/memory/` before working here (testing setup).
