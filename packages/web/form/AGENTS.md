# @web/form — AI Instructions

## What it is

The form system of the web apps, built on TanStack Form: the form
hook factory, the form/field/step compounds and the built-in fields (text,
select, password, OTP, crop image, ...).

## Main technologies

- [TanStack Form](https://tanstack.com/form)
- [`@web/ui`](../ui/AGENTS.md) for the visual building blocks, [`@web/shared`](../shared/AGENTS.md) for utilities
- [Zod](https://zod.dev/) (validation schemas live in the consuming code)
- TypeScript (strict)

## Useful scripts

Run from `packages/web/form`:

- `bun run lint` — type-check plus Biome check; run it after every change
- `bun run lint:fix` — Biome check with auto-fix
- `bun run ts:check` — TypeScript type-check only

## Conventions

- Compound components, see [`.agents/rules/web/react/compound-components.md`](../../../.agents/rules/web/react/compound-components.md). The package exposes `Form`, `Field` and
  `StepForm`.
- **Registration**: the app creates its hooks with `createAppForm`, passing
  the fields/form components that are specific to the project. Those are
  merged with the built-in ones, and the app's win on name clashes. Fields
  tied to the product (feeds, mentions, uploads...) stay in the app.
- **Errors**: `Form.error` shows only the form's submit error (validators of
  the form on submit, or what the submit handler threw); `Field.error` shows
  every non-submit error of the field. A thrown submit error is caught by
  the hook returned by `createAppForm` and stored as the submit error; the
  app teaches it how to read a message with `getSubmitErrorMessage`.
- `Form.*` parts and `StepForm.step`/`buttons` read the form context, so
  they must be rendered inside `<form.AppForm>`.
- Multi-step forms use `StepForm`: each step is its own `<form>`; the
  default action goes to the next step (the last one submits) and
  `onStepSubmit` overrides it. Steps can be turned off with `enabled`.
- **Crop image field**: choose, crop and confirm steps. `uncroppableFileTypes` are sent whole,
  skipping the crop (an animated GIF can't be cropped in the browser without being flattened),
  `getIsFileTypeAllowed` with `onFileTypeBlocked` lets the app refuse a type (and explain why) and
  `maxFileSizeInBytes` is checked on the file that is really sent.
- Keep it free of app code: API calls, toasts and routing are injected by
  callbacks or by the app's own registered components.
