# @web/infinite-list — AI Instructions

## What it is

The infinite list of a web app, kept generic so another project
can reuse it: a virtualized list, a simple list, and the scroll container
they live in. It knows nothing about the data source or the router.

## Main technologies

- [TanStack Virtual](https://tanstack.com/virtual) and `react-intersection-observer`
- [Tailwind CSS 4](https://tailwindcss.com/) for the few default styles
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/infinite-list`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- `InfiniteListScroll` is the scrolling container (with a `header` part and
  a `scrollToTop` part). `VirtualInfiniteList` must be inside it;
  `SimpleInfiniteList` needs no container.
- Both lists receive the data and its states as props (`data`,
  `isLoadingInitialData`, `isFetchingNextPage`, `isNextPageAvailable`,
  `isNextPageError`, `onScrollNearEnd`) and the visual parts as slots
  (`renderItem`, `renderEmpty`, `renderFooter`, `renderNextPageLoader`,
  `renderNextPageError`, `renderInitialLoader`).
- `SimpleInfiniteList` lays the items out with `listVariant` (`vertical`,
  `horizontal`, `grid`). Use `custom` when the `className` brings the whole
  layout (an `@utility` with its own columns and gap): the default classes of
  the other variants would be kept next to it and can win in the CSS.
- **Loaders in a grid**: the initial loader replaces the list (it is not inside the list's element) and the next page loader, the footer and
  the empty state share the last `<li>` of the list, which spans every column (`col-span-full`). A skeleton loader of a grid feed therefore
  brings the same grid classes as the list, once as the initial loader and once as the next page loader (never `enableFragment`, which
  would stack the skeletons in one column).
- Slots are rendered through a stable wrapper: they can use hooks and an
  inline arrow function doesn't remount the rows.
- **Pagination trigger**: the loader at the end fires `onScrollNearEnd` when
  it gets in view, and again when more items arrive while it is still in
  view. A failed page does not retry by itself: `isNextPageError` swaps the
  loader for the error slot, whose `retry` calls `onScrollNearEnd`.
- The virtual list's end row hosts the loader, footer or empty state and is
  always measured, since its content changes with the list's state. Item
  rows have a fixed height from `estimatedItemHeight` unless
  `enableElementMeasurement` is on.
- The lists set `aria-busy` while a page is being fetched. `role="feed"` is
  not used: it requires `article` children, and the rows are list items.
- Keyboard navigation is off by default; when on, only the most recently
  mounted list reacts.

## Conventions

- Keep it free of app code: no router, no data fetching, no `@web/ui`.
  Scroll restoration comes in through `initialScrollOffset`, which the
  app feeds from its router. Apps pass their own slots where the defaults
  (plain text and a spinner) don't fit.
- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- Slots return `ReactNode` and are called with props, never used as plain
  function components by consumers.
- Feed `isFetchingNextPage` from the query's `isFetchingNextPage`, not from
  `isFetching`. The list uses it to disable the pagination trigger while a page
  is on its way, to hide the error slot while a retry runs and to set
  `aria-busy`. `isFetching` is also true on any background refetch (a window
  focus, for example), which would pause the trigger, hide a page error and mark
  the list busy while no page is being loaded.

## Memory

Check `.agents/memory/` before working here (testing setup).
