---

paths:

- "apps/web/src/lib/seo/**"
- "apps/web/src/routes/**"
- "apps/web/server/routes/**"
- "apps/web/vite.config.ts"

---

# SEO

## How the tags reach the page

Checked in `packages/web/seo` and `packages/web/server`. The tags of a page can be
written in four places, and each request gets one of them:

1. **Build, the shell.** `seoPrerender` (in `vite.config.ts`) writes the site's
   defaults from `src/lib/seo/seo.ts` into the `<head>` of the `index.html`. Every
   route that is not prerendered and not a server page gets this shell.
2. **Build, prerender.** For each route with `staticData.prerender: true`, the
   plugin writes `<address>/index.html`: the shell, with the site's defaults, the
   page's `seo` and a canonical link. It also writes `sitemap.xml` with the pages
   that are not `noIndex`. The static file server answers that address with the file.
3. **Request, server page.** A route in `server/routes/` (`defineHeadRoute`) takes
   the shell, reads the data and puts the tags of the content into its `<head>`.
   With no content it answers the shell with a `noindex` tag and `200`, and does
   not cache it. The `x-robots-tag` header is sent when the page is not indexable.
4. **Browser.** TanStack Router renders the page and writes the `head` of the
   matched routes (`meta` and `links`) into the document, after the JavaScript runs.

So a crawler that does not run JavaScript only sees 1, 2 and 3. The browser sees
all of them, and then 4 replaces what it sets with the same key.

**The pattern:** the root route sets the site's defaults in `head` with
`buildDefaultMeta` from `src/lib/seo/seo.ts`, so the browser and the build read the
same source. The entry (`main.tsx`) calls `removeSeoHeadTags()` before the app
mounts, so the tags the build and the server wrote are taken out and the router
writes its own. The template does neither yet (see the drift below).

## The rule

TanStack Router merges the `head` of the routes that match: a child's tag with
the same key (`title`, `name`, `property`) replaces the parent's, and the other
tags are inherited. So the defaults of the site (in `__root.tsx`) apply to every
page, and a route that changes nothing needs nothing.

- **`staticData` and the meta tags are optional.** A route without them keeps
  the defaults of its parents.
- **Whenever a route changes a value of a meta tag, it does so with
  `staticData.seo`**, through `pageHead`. Never with a meta tag written by hand in
  `head`.
- `head` is used for what `staticData` does not carry: `links` and `scripts`
  (see `pageHead` below), and the templates of a route whose tags come from the
  server (see [dynamic pages](#pages-whose-tags-come-from-data)).

```tsx
export const Route = createFileRoute("/about-us/")({
  staticData: { seo: { title: "Sobre nós", description: "FIXME: what the page is about." } },
  head: pageHead,
  component: RouteComponent,
});
```

### `pageHead`

`pageHead` lives in `src/lib/seo/page-head.ts`. It reads `match.staticData.seo`
and returns the `meta` of the page, built by `buildPageMeta`. It returns nothing
when the route has no `seo`, so the parents' tags stay.

- It takes an optional second argument with the other fields of TanStack's
  `head`: `links` and `scripts`. Those are not SEO values, so they can be written
  in `head` directly, through `pageHead`.
- `meta` is never an argument: it only comes from `staticData.seo`.

```tsx
export const Route = createFileRoute("/app/")({
  staticData: { seo: { title: "Início" } },
  head: (ctx) => pageHead(ctx, { scripts: [{ src: "https://FIXME/analytics.js" }] }),
});
```

- `seo.title` is required; the brand is added after it. `description` and
  `noIndex` are optional.
- The values are **literals**, so the build can read them (see below).

### Templates

Templates are the values that several routes repeat, so they are written once in
`src/lib/seo/templates/`:

- **`noIndexHead`**: the `robots` tag that keeps a page out of search engines.
  Use it in `head` only for
  a route that has no `staticData.seo` to carry the `noIndex` (a route whose SEO
  is dynamic, see below). For a page with `staticData.seo`, use `noIndex: true`
  there instead.

- **Known drift:** the template routes (`_landing-pages/about-us`, `auth/login`,
  `app/index`, `_landing-pages/index`) still write `head: () => ({ meta: [{ title }] })`.
  `src/routes/__root.tsx` already uses `seo.buildDefaultMeta` from `src/lib/seo/seo.ts`,
  and `src/routes/app/route.tsx` uses the `NO_INDEX` constant of `@web/seo`. And
  `src/main.tsx` does not call `removeSeoHeadTags()`. `pageHead` and the templates do
  not exist in the code yet. Each of them goes to this rule when it is changed.

## Prerender: a choice per route

`staticData.prerender: true` tells the build to write the page to an `index.html`
of its own, with the tags, and to put it in `sitemap.xml`. Crawlers that do not
run JavaScript, and link previews, only read the tags of a prerendered page.

This is not server rendering of the content. The body of the HTML stays the
empty `<div id="root">`, and TanStack renders the page in the browser after the
JavaScript loads. Only the `<head>` of the HTML changes.

**Whether a route is prerendered is the user's decision.** The agent does not turn
it on or off on its own; ask first.

```tsx
staticData: { prerender: true, seo: { title: "Sobre nós" } },
```

- The plugin reads `staticData` without running the file, so a value that needs
  code (a call, a variable, an `as const`) fails the build and names the node.
- The page must have no parameters in its address; the build fails otherwise.
- `noIndex: true` writes the page with the tag and keeps it out of `sitemap.xml`.
- The address is the route path without the pathless groups (`_landing-pages`)
  and without the trailing slash.

## Pages whose tags come from data

A page whose title or image depends on data (a shared post, a profile) cannot
read its data in `staticData`. For those, the server reads the data and writes
the tags, in a file of `apps/web/server/routes/`, built with `defineHeadRoute`
(see [server](./server.md)).

The server writes only the `<head>`, not the page. It takes the
`index.html` of the build, adds the tags of the content to its `<head>`, and sends
it to the browser. The body stays the empty `<div id="root">`, so the server
needs no React and no rendering of the page: TanStack renders the page after the
JavaScript runs. That is why the head can be made on the server while the page is
still a SPA.

- The page is on screen for a few seconds before the app redirects or shows its
  own content, so the SPA route of such a page **does not need** `staticData.seo`
  for those tags. It may keep a `head` with a template (for example
  `noIndexHead`), which is the exception to "meta tags change through
  `staticData`".
- Whether a page is dynamic is the user's decision. Only add one when the user
  decides the page needs it. The template has no such page yet.
- A route that only redirects can use `noIndexHead` on its layout route, so its
  children inherit the `noindex`.

### Structure of `server/routes/`

The server uses file routing (Nitro): the path of the file is the address of
the page, and a name in brackets is a param.

```
server/routes/
  share/
    post/[postId].ts        -> /share/post/:postId
    profile/[username].ts   -> /share/profile/:username
```

- One folder per part of the address, the same as the URL of the page. Never a
  folder just to group files.
- Each file has **one** `defineHeadRoute` as its default export and nothing else.
- Schemas of the params stay in the file (they are small); the shared API
  schemas come from `@shared/routes`, not from a copy.
- Constants used by several routes go in `server/constants/`, and the envs of the
  server through `serverEnv` (see [server](./server.md)).
- Helpers that are not a route go in `server/utils/`, one function per file.

### Example

A generic page `/items/:itemId`, the tags of an item. The schemas and the names
are placeholders (`FIXME`):

```ts
// server/routes/items/[itemId].ts
import { z } from "zod";

import { itemResponseSchema } from "@shared/routes/api/items"; // FIXME: the real contract of the item
import { buildMeta } from "@web/seo/head";
import { defineHeadRoute } from "@web/server";

import { serverEnv } from "../../constants/server-env";
import { DESCRIPTION_MAX_LENGTH } from "../../constants/seo";

export default defineHeadRoute({
  params: z.object({ itemId: z.string().uuid() }),

  // Asks the API for the item. `null` (not found, not public, API down) gives the tags of the site.
  load: ({ params, api }) => api.get(`/items/${encodeURIComponent(params.itemId)}`, itemResponseSchema),

  // The tags of the item, from its content.
  tags: (item) =>
    buildMeta({
      title: `${item.name} | FIXME`,
      description: (item.description ?? "FIXME: a default description").slice(0, DESCRIPTION_MAX_LENGTH),
      url: `${serverEnv.VITE_FRONTEND_URL}/items/${item.id}`,
      image: item.imageUrl,
      siteName: "FIXME",
      type: "article",
    }),

  indexable: true,
});
```

- `load` gets the params already checked by the schema, and an `api` that
  answers `null` on failure: the page never breaks.
- `tags` only builds the values; the escaping is done by `@web/seo/head`.
- `indexable` is `false` by default (a `noindex`); set it to `true` only for
  pages that should be indexed.

## Keep one source

- The site's defaults are in `src/lib/seo/seo.ts`: the brand, the title, the
  description and the image that every page shares.
- Never write a tag by hand. Add the value to `staticData.seo` or to the `tags`
  of a server route, and let `@web/seo` write it.
- Don't build HTML strings with the content of a post or any user data.

## Don'ts

- Don't write a meta tag in `head` directly; use `staticData.seo` and `pageHead`.
  The exceptions are the server pages and the templates above.
- Don't add `staticData` or `head` to a route just to repeat the parents' values.
- Don't compute a title in `staticData`: it is read without running the code.
- Don't add `prerender: true` to a route with parameters.
- Don't turn `prerender` on or off without asking the user.
- Don't import `@web/seo/vite` into browser code, or `@web/seo/head` into the app.
