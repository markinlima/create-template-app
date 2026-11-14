# @web/theme — AI Instructions

## What it is

The theme system of the web apps: it defines what a theme is and
manages the chosen one. It does **not** contain any theme: the app defines
its own themes, grouped by the level a user needs to use them.

## Main technologies

- React (provider + hook), Zustand (state and persistence), CSS variables on the `<body>`
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/theme`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- `defineTheme` types a theme: every color token is required and the
  literal `name` is kept, so the names are typed as a union.
- `createThemeRegistry` groups the app's themes: lookup by name, themes by
  level, and whether a level may use a theme. It validates duplicated names
  and requires the default theme to be free (level 0).
- `createTheme({ registry, storageKey })` is called once by the app and returns
  `ThemeProvider`, `useTheme` and the `store`. State lives in a Zustand store
  (`persist` keeps only the chosen theme **name**); there is no React context.
- `ThemeProvider` takes the user's `userLevel`, gives it to the store and applies
  the resolved theme to the body (CSS variables, `data-theme`, `data-scheme`)
  in a layout effect. While the chosen theme is not allowed for the level, the
  default theme is applied and the choice is kept for when it is.
- `useTheme` reads the store with `useShallow`: `theme`, `userLevel`,
  `setTheme` (returns `false` if the theme doesn't exist or isn't allowed) and
  `isThemeAllowed`. Theme names are typed from the registry.

## Conventions

- `level` is a plain number. Mapping a subscription or plan to a level is
  the app's job, the lib never knows what a level means.
- Do not read the session, the router or any app state here.

## Memory

Check `.agents/memory/` before starting work here (testing setup).
