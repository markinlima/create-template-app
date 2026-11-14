# @web/shared — AI Instructions

## What it is

Framework-agnostic utilities, React hooks and small libs shared by the web
app and the other web packages (formatters, random helpers, infinite-data
cache helpers, toggle hooks, dayjs setup...).

## Main technologies

- TypeScript (strict), React hooks
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- [dayjs](https://day.js.org/), [Immer](https://immerjs.github.io/immer/), TanStack Query types

## Useful scripts

Run from `packages/web/shared`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Conventions

- Four entries, each with its own `index.ts` that only exports: `@web/shared/utils`, `@web/shared/hooks`, `@web/shared/lib` (the
  `dayjs` setup) and `@web/shared/infinite-data` (apart, so the apps that don't use it don't take Immer and TanStack Query). A
  new file is exported from the `index.ts` of its entry. Folders follow
  [the web lib structure](../../../.agents/rules/web/libraries/web-lib-structure.md): `utils/` (grouped by concern), `hooks/`, `lib/`,
  `constants/` and `types/`; one function per file, with its test next to it.
- `utils/infinite-data` works on the cache of the API of the project: it imports `OpenApiTag`, `PaginationType`, `DataShape` and
  `CursorPaginationMeta` from `@shared/routes`, which defines them. Don't change those names here.
- Only generic code lives here. If something needs the app (its API client,
  toasts, routes, env), it stays in the app, or it receives that through
  parameters.
- No components and no styling: UI belongs to `@web/ui`.
- Every util has a test next to it; hooks are covered when they hold logic
  that can be tested without a browser.
- Function parameters follow the repo rule: one value directly, an input
  plus an `options` object, or a single `options` object.

## Memory

Check `.agents/memory/` before working here (testing setup).
