# @web/analytics — AI Instructions

## What it is

Typed client-side wrapper over the Umami tracker script (`window.umami`) used by the web app
to send custom events, plus a helper to build share URLs with standard UTM params.

It is intentionally **not** `@umami/node`: a server-side send comes from the server's IP with no
visitor session, which breaks the link between an event and its visitor and UTM. Events go
from the browser, where the visitor's session already exists.

## Main technologies

- TypeScript (strict)
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- No runtime dependencies

## Useful scripts

Run from `packages/web/analytics`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Conventions

- `createTracker<TEvents>()` returns `{ track, identify }`. `enabled` is a boolean or a function asked on every event (the visitor's choice). The event map is defined by the app
  (the app owns the event names and payloads); `track` is typed from it, and an event mapped
  to `undefined` takes no data.
- Behavior: if `window.umami` is missing yet, events wait in a bounded
  queue (polled every 250 ms for up to 10 s), then are flushed or dropped; every call to the
  tracker sits in `try/catch`, so analytics never breaks the UI.
- Payloads are flat (`string | number | boolean`), with no free text and no personal data.
- Metrics are anonymous and aggregated by default. `identify(userId)` exists only for a visitor who agreed to be tracked by id (the app's privacy module decides and calls it): it takes an internal id, never a name, an e-mail or anything personal.
- `debug` is a boolean or a function asked on every event (so an app can switch the `console.debug` log at runtime).
- `withUtm(url, options)` sets `utm_source`, `utm_medium`, `utm_campaign` and optionally
  `utm_content`, keeping the query the URL already has.
- Function parameters follow the repo rule: one value directly, an input plus an `options`
  object, or a single `options` object.

## Memory

Check `.agents/memory/` before working here (testing setup).
