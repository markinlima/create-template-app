---

paths:

- "apps/web/**"
- "packages/web/**"

---

# Loading states: skeletons first, loaders when a skeleton is not viable

The app prefers **skeletons**: they show the shape of what is coming, so the page
feels fast. A route loader that blocks the navigation is the exception, for pages
that cannot be drawn without the server's data. Data fetching itself (the cache,
the query options) is in [query-cache](./query-cache.md).

## Default: skeletons

- Every piece that loads its own data shows a skeleton while it waits: an
  infinite feed, a card, a preview inside a page (a collection preview of the
  profile, a streak card).
- A skeleton copies the layout of the real component (same sizes, same
  structure) so nothing jumps when the data arrives.
- Feeds use a generic skeleton maker: it receives the skeleton of one item and
  repeats it `count` times. Build one per app if it does not exist yet, instead
  of writing a feed skeleton per screen (see
  [dont-repeat-yourself](../structure/dont-repeat-yourself.md)).
- Keep the skeleton of an item next to the item (`skeleton-<item>.tsx`), so
  they change together.

## When a skeleton is not viable: route loader

Use the loader **only** when the page depends 100% on the API and a skeleton of
the whole page would be expensive to build and to keep up to date. Typical case:
the ranking pages, where every element of the screen comes from the same data.

- Await the data in the route's `loader` with the `queryClient` of the router
  context (`context.queryClient`, typed in `src/types/tanstack-router.d.ts`).
  Don't create a new `QueryClient` or import one in the route: the context
  holds the app's client, and a second one has its own cache. Call
  `queryClient.query` or `queryClient.infiniteQuery` with the generated
  `*QueryOptions` and `staleTime: "static"`, and read the data in the component
  with the generated `*Suspense` hook. Route setup is in [routes](./routes.md).
- Give the route an `errorComponent` when the loader can fail (see the
  profile route in the reference app).

## Mixing: the critical data in the loader, the rest with skeletons

When a page has one request that decides what it is (the user of a profile)
and other requests that only fill it (posts, collections, streak):

- **Await only the critical request** in the loader. The page renders with its
  main content at once.
- **The rest keeps its own skeleton**, inside the page, and loads after the
  page is on screen.

This gives the feel of a fast page without a skeleton for the whole screen.

## Don'ts

- Don't build a skeleton for a whole page that depends only on the API when a
  loader does the job.
- Don't await in a loader what the page can show with a skeleton: the navigation
  waits for every awaited request.
- Don't move the data of a small component into a loader to avoid its skeleton.
- Don't use `ensureQueryData` or `ensureInfiniteQueryData` (deprecated, see
  [query-cache](./query-cache.md)).
