# @web/alert — AI Instructions

## What it is

The alerts of a web app: a dialog that shows notices (release notes,
a warning, a form to agree to something) page by page, each only once, with a
level of importance that decides how the user can close it. The app gives it a list of
alerts; it doesn't know where they come from. **What is inside each alert is drawn by a
component chosen by the alert's content `type`**, so the app can register its own kinds
(a terms form, a survey) next to the built-in markdown one.

## Main technologies

- [Base UI Dialog](https://base-ui.com/react/components/dialog), through [`@web/ui`](../ui/AGENTS.md)
- [@tanstack/markdown](https://tanstack.com/markdown) for the text of a markdown alert
- [Tailwind CSS 4](https://tailwindcss.com/)
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/alert`:

- `bun run test` — run the `bun test` suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- `AlertCenter` is placed once, high in the tree. It takes `alerts`, an optional
  `contentComponents`, an optional `seenStorageKey` and an optional `onSeen`.
- An `AlertItem` is `{ id, content }`. The `id` stays out of the content because "seen" is
  remembered by it. The `content` is a union discriminated by `type`; every kind extends the
  base content: `type`, `importance`, `title` and an optional `variant` (`update`, `info`,
  `warning`: the icon and color of the heading, `info` by default). The dialog draws
  the heading for every type; the component of the type draws everything under it.
- **Built-in type `markdown`**: `body` (markdown), optional `buttonLabel` and `cooldownSeconds`.
  Text, lists, links and images; raw HTML is shown as plain text, never rendered, and unsafe
  URLs are dropped. Links open in another tab and images load late.
- **Importance** decides how it closes while that alert is on the screen. `low` lets the dialog
  close any way (the X, a click outside, Escape or the button). `medium` only closes with the
  button. `high` is like `medium`, and its button waits a few seconds (5 by default). The most
  important alerts come first, so the user passes every alert that must be read before reaching a
  `low` one, and from there on can close the dialog freely.
- **One dialog, page by page, each alert once**: the alerts not seen yet are put in order (the most
  important first, then the order of the list) and shown in a single dialog that stays open from
  one to the next. The list is fixed when the dialog opens: alerts that arrive later wait for the
  next time. An alert whose `type` has no component is skipped (but its id still counts as current,
  so its "seen" is not lost).
- **An alert counts as seen** when it goes to the next one or is closed (closing before the end is
  only possible on a `low` alert and leaves the rest for the next time). Going back and forward
  again never tells the API twice. An alert already read is not waited for again.
- **Seen alerts** are remembered in the browser under `seenStorageKey`, so use one key per user.
  Without a key they are only remembered until the page closes. `onSeen` is called when an alert
  is seen, to tell an API. **Ids saved that are not in the list of `alerts` any more are removed
  from the browser**, so the storage doesn't pile up: give it the whole list, never one that is
  still loading.
- **Size**: with several alerts the dialog has a fixed height, so the buttons don't move between
  them; a lone alert is as tall as its text, up to the height of the screen.

## The queue, the hooks and the parts

The dialog shares the state of the queue with everything inside it through a React context.
`useAlertQueue()` returns it: `alerts`, `current`, `index`, `total`, `hasSeveral`, `isFirst`,
`isLast`, `isRevisit`, `canDismiss` and the actions `next()` (marks the current alert as seen and
goes on; at the last one it closes), `back()` and `close()` (marks it as seen and closes, whatever
the importance). It throws outside the dialog.

The parts below are compound parts of `AlertCenter`. They read the queue, so they only work inside
the component of a content type, and each takes every prop of the element it renders:

- `AlertCenter.nextButton`: a `Button` that waits by the importance of the alert (or `cooldownSeconds`)
  and shows the seconds left. Its text is "Entendi" (a lone alert), "Próximo" or "Concluir", or its
  `children`. It is disabled while it waits or when the `disabled` prop is true. `onClick` runs first,
  then it goes to the next alert, unless the handler called `event.preventDefault()`: then the
  handler takes it on itself (a form that saves first and calls `next()` after).
- `AlertCenter.backButton`: a `Button` that goes back; nothing is drawn at the first alert. Same
  `onClick` and `preventDefault()` behavior.
- `AlertCenter.dots`: one dot per alert, the current marked. It only shows where the user is.
- `AlertCenter.body`: the scrolling box of the content; the next alert starts from its top.
- `AlertCenter.footer`: the dialog footer with the dots on the left and its `children` (the
  buttons) on the right, and the text read aloud when the alert changes.

## Adding a kind of content

1. Define the content type extending `AlertContentBase` with a literal `type`
   (e.g. `terms-form`) and its own fields.
2. Write a component that receives `{ alert, content }` and renders the body and the footer, using
   the parts and `useAlertQueue`. The built-in markdown component is the model.
3. Register it: `<AlertCenter alerts={alerts} contentComponents={{ "terms-form": TermsForm }} />`.
   `AlertCenter` is generic over the union of the app's contents
   (`MarkdownAlertContent | TermsFormContent`): the keys of `contentComponents` are the custom
   `type`s and each component gets its content narrowed. `markdown` is always available and can't
   be replaced.

## Conventions

- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- Keep it free of app code: no router, no data fetching. What the app knows (the list of
  alerts, the key of the user, the components of its own kinds) comes in through props.
- Colors come from the theme, never from fixed values.
- There is no confirmation checkbox any more: an alert that needs an action (agree, answer) is a
  custom kind of content.

## Memory

Check `.agents/memory/` before working here (testing setup).
