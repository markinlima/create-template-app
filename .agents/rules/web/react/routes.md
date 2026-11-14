---

paths:

- "apps/web/**"

---

# Route files

- **One folder per URL** under `src/routes`, with an `index.tsx`
  (`routes/app/ranks/streak/index.tsx` → `/app/ranks/streak`). A folder's
  `route.tsx` is its layout (renders `<Outlet />`); `_name` folders are
  pathless layout groups (`_landing-pages`); dynamic segments
  are `$param`. These TanStack Router names are the only exception to
  kebab-case file names.
- The route tree is generated and git-ignored — never edit it. Declare
  routes with `createFileRoute("<path>")`; the path string must match the
  file location (the generator rewrites it).
- **Keep route files thin**: declare `component`, `loader`, `beforeLoad`,
  `validateSearch`/`params.parse`, `head`, `errorComponent`, and compose
  components from `modules/` and `components/`. Page UI and logic live in
  the module.
- Validate search params with a Zod schema (`validateSearch`) and path
  params with `params: { parse }` when the format matters (UUIDs).
- **A small schema may live in the route file**, right above
  `createFileRoute`, when it only validates that route's params or search. It
  is the one exception to "thin" routes: the schema is then found where the
  parameter is defined, without opening another file. A schema used by more
  than one route, or a big one, goes to `schemas/` ([dont-repeat-yourself](../structure/dont-repeat-yourself.md)).
- **A route may define its own `errorComponent`** when its error needs a
  specific screen (for example, a profile that fails differently from a
  ranking). Without one, the route uses the default error component of the
  project, set up in the router.
- Prefetch in `loader` with `context.queryClient` (the router context also
  carries `session`, typed in `src/types/tanstack-router.d.ts`):
  `queryClient.query({ ...<generated>QueryOptions, staleTime: "static" })` or
  `queryClient.infiniteQuery(...)`, and read with the generated `*Suspense`
  hook. Await the loader only when the page can't render without the data; see
  [loading](./loading.md).
- **Meta tags** (`head`, `staticData`) follow [seo](../structure/seo.md): how
  the tags reach the page, which routes are prerendered or served by the server,
  and when a route sets its own `seo`.
- **Redirects must be thrown**: `throw redirect({ … })` or
  `redirect({ …, throw: true })`. A bare `redirect({ … })` does nothing.
- Authenticated pages go under `routes/app/`, whose `route.tsx` is the layout
  that guards the session and renders the private shell. Public pages go under
  `_landing-pages` or `auth`.
- Add new route constants (default URLs) to the `core/routes.ts` object, and
  breadcrumb entries to the constants of the header in `layout/header/`.
- The app is a SPA: the routes render only in the browser. The build can write
  a static `index.html` with the tags of a route (prerender), and the only
  server-side piece is the Nitro server, which can inject tags into the
  `index.html` for a route, based on the files of `server/routes/`. Everything
  about the tags, prerender and the server routes is in [seo](../structure/seo.md).
  The app's own description is in [the web app's AGENTS.md](../../../../apps/web/AGENTS.md).
