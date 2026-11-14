# @web/toast — AI Instructions

## What it is

The toast system of the web libs: a programmatic `toast` API, the
provider that renders the toasts, and a customizable base toast.

## Main technologies

- [Base UI Toast](https://base-ui.com/react/components/toast)
- [Tailwind CSS 4](https://tailwindcss.com/). The basic toasts use `Button` from `@web/ui`, so their actions look like the rest of the app
- [`bun:test`](https://bun.com/docs/test/writing-tests) for tests
- TypeScript (strict)

## Useful scripts

Run from `packages/web/toast`:

- `bun run test` — run the `bun test` suite
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
- Basic toasts have a close button (`Fechar`). Error toasts use `role="alert"`, the others `role="status"`.

## Conventions

- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md).
- The stacking animation needs CSS variables set by Base UI, so it lives in
  a CSS file that the app imports; everything else is Tailwind classes on
  the theme tokens. The app must also point Tailwind's `@source` here.
- Whether a failed request should toast is an app decision: no toast is
  fired from this package.
