# @web/alert — AI Instructions

## What it is

The alerts of the web apps: a dialog that shows notices (release notes, a
warning, a punishment) page by page, each only once, with a level of importance that
decides how the user can close it. The app gives it a list of alerts; it doesn't know
where they come from.

## Main technologies

- [Base UI Dialog](https://base-ui.com/react/components/dialog), through [`@web/ui`](../ui/AGENTS.md)
- [react-markdown](https://github.com/remarkjs/react-markdown) for the text of an alert
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/alert`:

- `bun run test` — run the Vitest suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- `AlertCenter` is placed once, high in the tree. It takes `alerts` (a list of
  `AlertItem`), an optional `seenStorageKey` and an optional `onSeen`.
- An `AlertItem` has an `id`, a `type` (`update`, `info`, `warning`, `punishment`: the
  icon and color), an `importance`, a `title` and a markdown `body`, plus an optional
  `buttonLabel` and `cooldownSeconds`.
- **Importance** decides how it closes while that alert is on the screen. A `low` alert lets
  the dialog close any way (the X, a click outside, Escape or the button). A `high` or
  `critical` one only closes with its button. Since the most important alerts come first,
  the user passes every alert that must be read before reaching a `low` one, and from there
  on can close the dialog freely. A `critical` alert's button also waits a few seconds
  (5 by default) before it works.
- **One dialog, page by page, each alert once**: the alerts not seen yet are put in order
  (the most important first, then the order of the list) and shown in a single dialog that
  stays open from one to the next. The list is fixed when the dialog opens: alerts that
  arrive later wait for the next time. Dots show where the user is (they only show it,
  they are not a control).
- **A confirmation** (`confirmationLabel`): an alert can ask for a checkbox with that text,
  shown above the button and the dots, and its button only works while it is checked. It
  adds to the wait of a `critical` alert (both have to be over), and it stays checked
  when the user comes back to the alert.
- **A back button** (from the second alert on) returns to the previous alert. An alert that
  was already read is not waited for again, and the API is not told twice that it was seen.
- **The button** moves to the next alert and closes the dialog at the last one. Its text
  is the one the alert asks for, or "Entendi" for a lone alert and "Próximo" and "Concluir"
  when there are several. An alert counts as seen when its button is used or when it is
  closed; closing before the end (only possible on a `low` alert) leaves the rest
  for the next time.
- **Size**: with several alerts the dialog has a fixed height, so the button doesn't move
  between them; a lone alert is as tall as its text, up to the height of the screen.
- **Seen alerts** are remembered in the browser under `seenStorageKey`, so use one key
  per user. Without a key they are only remembered until the page closes. `onSeen` is
  called when an alert closes, to tell an API.
- **Markdown**: text, lists, links and images. Raw HTML is shown as plain text, never
  rendered, and unsafe URLs are dropped. Links open in another tab and images load late.

## Conventions

- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- Keep it free of app code: no router, no data fetching. What the app knows (the list of
  alerts, the key of the user) comes in through props.
- Colors come from the theme, never from fixed values.
