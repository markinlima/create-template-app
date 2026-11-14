# @web/update — AI Instructions

## What it is

The update check of a web app, as a library: it tells an open tab that a build other than the one it is running was published. Two entries:

- `@web/update` — `createUpdateChecker(options)` (the runtime, which the browser bundles). It returns `useHasNewUpdate()` (a boolean), `useUpdateData()` (the content of the update file as published at the last check, for anything the app needs to do with it), `useUpdateState()` (both, as one object, for a component that needs them) and `check()`.
  The app calls `createUpdateChecker` once, in a file of its own, and uses the hooks anywhere: they share one timer and there is no provider.
- `@web/update/vite` — `updateChecker(options)`, a Vite plugin: it gives the build an id, writes the update file into the client build and
  defines the id as `import.meta.env.VITE_BUILD_ID`, which the app hands to `createUpdateChecker` as `currentBuildId`.

The notice the user sees is not here: it belongs to the app.

## Main technologies

- [Vite](https://vite.dev/) plugin API
- [Zustand](https://zustand.docs.pmnd.rs/) (the update state, a vanilla store read with `useStore`) and [Zod](https://zod.dev/) (the shape of the update file)
- React
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/update`:

- `bun run test` — run the `bun test` suite (every `*.test.ts`)
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run ts:check` — TypeScript type-check only

## How it works

- **The build id is a timestamp** (the time the build started), made once per Vite run so the file and the code carry the same one. Every
  build has a new id, so every build is told to the tabs that run an older one, even a rebuild of the same code. That is on purpose: a
  build only goes out with a release, so there is no "same build" worth hiding. It does not depend on any version number, which belongs to
  the release (and to the API), not to the check.
- A tab knows which build it runs from the id the code was made with, not from anything saved in the browser. It asks for the file with
  `cache: "no-store"` (no browser cache and no service worker), every `intervalMs` and when it comes back to the front. A different id is
  an update. A failed or unexpected answer (offline, a missing file, the HTML of the app instead of JSON) is never an update.
- Once a tab is told there is an update it stays told: that tab keeps the old code until it reloads.
- A lazy chunk that fails to load (`vite:preloadError`: the old build's files are gone from the server) also counts as an update, unless
  `treatPreloadErrorAsUpdate` is `false`.
- The file is `{ ...content({ buildId }), buildId }`: the app can add fields (release notes, a version number, a flag) through the `content`
  option of the plugin and read them with `useUpdateData`; `buildId` can't be replaced. The `schema` option of the checker types the fields the app
  added (an extension of `updateFileSchema`, which is an object with a `buildId` string and keeps the other fields).
- The hooks call `watch`, which counts its callers: the timer and the listeners run only while a component reads a hook, and stop with the last.
- The web server must send the file with `no-cache` (the `web` app does it for `version.json`).
- Dependencies: it may use the libraries the project already uses (Zustand, Zod...); a new one is asked first, see
  [`.agents/rules/web/libraries/library-dependencies.md`](../../../.agents/rules/web/libraries/library-dependencies.md).
- Structure: see [`.agents/rules/web/libraries/web-lib-structure.md`](../../../.agents/rules/web/libraries/web-lib-structure.md).
