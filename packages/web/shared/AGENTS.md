# @web/shared — AI Instructions

## What it is

Framework-agnostic utilities, React hooks and small libs shared by the web
app and the other web packages (formatters, random helpers,
debounce/toggle/key-press hooks, dayjs setup...).

## Main technologies

- TypeScript (strict), React hooks
- [Vitest](https://vitest.dev/) for tests
- [dayjs](https://day.js.org/)

## Useful scripts

Run from `packages/web/shared`:

- `bun run test` — run the Vitest suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Conventions

- Consumers import by subpath, mirroring the folders (`utils`, `hooks`,
  `lib`); look at the folders for what exists.
- Only generic code lives here. If something needs the app (its API client,
  toasts, routes, env), it stays in the app, or it receives that through
  parameters.
- No components and no styling: UI belongs to `@web/ui`.
- Every util has a test next to it; hooks are covered when they hold logic
  that can be tested without a browser.
- Function parameters follow the repo rule: one value directly, an input
  plus an `options` object, or a single `options` object.
