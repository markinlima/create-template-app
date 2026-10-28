# @web/theme — AI Instructions

## What it is

The theme system of the web apps: it defines what a theme is and
manages the chosen one. It does **not** contain any theme: the app defines
its own themes, grouped by the level a user needs to use them.

## Main technologies

- React (provider + hook), CSS variables on the `<body>`
- [Vitest](https://vitest.dev/) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/theme`:

- `bun run test` — run the Vitest suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- `defineTheme` types a theme: every color token is required and the
  literal `name` is kept, so the app can derive a union of its theme names.
- `createThemeRegistry` groups the app's themes: lookup by name, themes by
  level, and whether a level may use a theme. It validates duplicated names
  and requires the default theme to be free (level 0).
- `ThemeProvider` takes the registry, the current user's level and a
  storage key. It applies the chosen theme to the body, persists only the
  theme **name**, and falls back to the default theme while the chosen one
  is not allowed for the user's level, keeping the choice for when it is.
- `useTheme` gives the current theme, `setTheme` (returns `false` if the
  theme doesn't exist or isn't allowed) and `isThemeAllowed`.

## Conventions

- `level` is a plain number. Mapping a subscription or plan to a level is
  the app's job, the lib never knows what a level means.
- Do not read the session, the router or any app state here.
