# @web/ui — AI Instructions

## What it is

The base UI component library of the web libs: buttons, dialogs,
inputs, selects, sidebar, cards and the other presentational building
blocks. It has no business logic and knows nothing about the app.

## Main technologies

- [Base UI](https://base-ui.com/) (headless, accessible primitives)
- [Tailwind CSS 4](https://tailwindcss.com/) + [Tailwind Variants](https://www.tailwind-variants.org/)
- [Lucide](https://lucide.dev/) icons, [Embla](https://www.embla-carousel.com/) for the carousel
- TypeScript (strict)

## Useful scripts

Run from `packages/web/ui`:

- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Conventions

- Every component is a **compound component**: root + parts attached with
  `Object.assign`, one file per part, camelCase parts (`Dialog.content`).
  See [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- Consumers import a component from its own entry point
  (`@web/ui/<component>`); look at the `exports` of the package and at the
  components folder for what exists.
- Colors and spacing come from the host app's theme tokens (`bg-background`,
  `text-foreground`, ...). The app must point Tailwind's `@source` at this
  package so its classes are generated.
- Keep it presentational and generic: no API calls, no routing, no app
  state. Generic hooks belong to `@web/shared`, not here. A dialog does not close on navigation: a controlled dialog (`open` and `onOpenChange`) is closed by the app.
- **Enter and leave animations are the default of the components.** What Base UI opens (dialog, sheet, popover, menus, select, tooltip,
  hover card and the backdrops) animates through `data-starting-style` and `data-ending-style` (not Radix's `data-[state]` and keyframes), with
  the classes of the `constants/` folder (`POPUP_MOTION`, `DIALOG_MOTION`, `DRAWER_MOTION`, `BACKDROP_MOTION`, `ACCORDION_MOTION`, `FULLSCREEN_CONTENT_MOTION`, `FULLSCREEN_OVERLAY_MOTION`). A new popup uses one of them
  instead of writing its own, so every app that uses the lib gets the same motion without any stylesheet. The "less motion" switch of the
  app turns them off with the rest.
