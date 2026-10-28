# @web/notification — AI Instructions

## What it is

The toast system of the web apps: a programmatic `toast` API, the
provider that renders the toasts, and a customizable base toast.

## Main technologies

- [Base UI Toast](https://base-ui.com/react/components/toast)
- [Tailwind CSS 4](https://tailwindcss.com/), with [`@web/ui`](../ui/AGENTS.md) for the base toast pieces
- [Vitest](https://vitest.dev/) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/notification`:

- `bun run test` — run the Vitest suite
- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## How it works

- The `toast` API (`success`, `error`, `warning`, `info`, `custom`,
  `dismiss`) works from anywhere, including outside React.
- `ToastProvider` is placed once, high in the tree. It sets the default
  position and can replace the layout of the basic toasts (`baseToast`) or
  their icons/colors (`variants`).
- **Positions**: the six screen positions (top/bottom × left/center/right).
  A toast can override the default. On mobile (below Tailwind's `sm`) every
  toast goes to the top.
- Each position has its own Base UI provider/manager: Base UI stacks and
  animates all the toasts of one provider together, so positions can't share it.
- `toast.custom` renders any component inside the same card, keeping the
  stacking, swipe, timeout and position behavior.

## Conventions

- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- The stacking animation needs CSS variables set by Base UI, so it lives in
  a CSS file that the app imports; everything else is Tailwind classes on
  the theme tokens. The app must also point Tailwind's `@source` here.
- Whether a failed request should toast is an app decision: no toast is
  fired from this package.
