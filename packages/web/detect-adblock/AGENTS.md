# @web/detect-adblock — AI Instructions

## What it is

Detects, in the browser, whether an ad blocker is on. A page cannot ask the browser, so `detectAdblock()` looks for the effects
of a blocker and answers `true` as soon as one of them shows. It only detects: what to do with the answer (the dialog that asks
the visitor to turn it off) belongs to the app.

## Entries

- `@web/detect-adblock` — `detectAdblock()` and its types. Browser only; the browser bundles it.
- `@web/detect-adblock/vite` — `adblockBait()`, the Vite plugin that makes the bait script available.

## Main technologies

- TypeScript (strict)
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- No runtime dependencies in the main entry. Browser only (it uses `document` and `fetch`).
- [Vite](https://vite.dev/) plugin API, for the `vite` entry only

## Useful scripts

Run from `packages/web/detect-adblock`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Folders

All under `src/`, laid out by [the web lib structure rule](../../../.agents/rules/web/libraries/web-lib-structure.md): the root is the main entry
(`index.ts`, the `detectAdblock` file, `constants/`, `types/`, `utils/`) and `vite/` is the `vite` entry, a mini `src` of its own.

## Don'ts

- Don't import `vite` from the main entry: the browser bundles it.

## Conventions

- `detectAdblock(options?)` runs its probes in parallel and resolves `true` with the first one that finds a blocker, or `false` when
  all of them are done and none did. A probe never rejects. Every probe only counts an error or a hidden element as "blocked"; a slow
  answer counts as "not blocked" (`timeoutMs`).
- The probes, each in its own file: a bait element with the class names of an ad that cosmetic filters hide; a bait script of the app
  (`ownBaitUrl`); a well-known ad script (`thirdPartyBaitUrl`); and the real requests the app passes in `requests`.
- **Blockers match by resource type, address and query string.** A `fetch` can pass where a `<script>` of the same path is cut, and
  an endpoint can be cut only with the query string the real code sends. So a request probe must be the same request the real code
  makes (same method and query), and a script probe uses `<script>`, never `fetch`.
- **The bait file comes from the Vite plugin.** `ownBaitUrl` defaults to `/ads/ads.js`, a path named like an ad on purpose. A missing
  file also fires the script's `error` event, which would count as a blocker, so the app must serve one. `adblockBait()` from
  `@web/detect-adblock/vite` does it: it writes the file into the client build and answers the same address in `vite dev`. If the app
  changes `ownBaitUrl`, it passes the same address as `path` to the plugin. Pass `ownBaitUrl: null` to skip the script probe.
- The lib doesn't know Umami or Sentry: the app builds the `requests` from its own envs.
- Function parameters follow the repo rule: one value directly, an input plus an `options` object.

## Memory

Check `.agents/memory/` before working here (testing setup).
