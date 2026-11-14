# @web/form — AI Instructions

## What it is

The form system of a web app, built on TanStack Form: the form
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
  and forms tied to the product (feeds, mentions, uploads, a login...) stay in
  the app, in its modules: the lib only keeps what any app can use. The
  rules for the app side are in
  [forms](../../../.agents/rules/web/react/forms.md).
- **Props of a control**: the lib sets `id`, `name`, `value`, `onChange`,
  `onBlur` and the aria attributes of a control; the prop types leave them out
  (see the `types/` folder). Props from the consuming code go first and
  the lib's own props after, so a control can't be broken by a prop.
- **Ids and aria**: `Field` gives each field one unique id (`useId`). The
  control, `Field.label` and `Field.error` link to it through `useFieldAria`.
  Put a control, its label and its error inside the same `Field`.
- **Focus on submit**: `Form` focuses the first control marked
  `aria-invalid="true"` when a submit is refused (see `utils/`).
- **Shared logic**: one function per file in `utils/`. `getErrorMessage` reads
  the message of an error with a fallback; `getVisibleFieldErrors` lists the
  errors that `Field.error` shows; `isSubmitBlocked` decides whether a submit
  button is disabled.
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

## Built-in fields

Registered by `createAppForm` under the name in the first column. All of them
take the `className` of the consuming code on their control, and the props of
the control they wrap (see the props rule above).

| Name                       | Control                    | Props                                                                                                            | Behaviour                                                                                                   |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `TextField`                | text input                 | `maxLength`, `disableCharCounter`                                                                                | Shows `n/max` above the input when `maxLength` is set.                                                      |
| `TextareaField`            | textarea                   | `maxLength`, `disableCharCounter`                                                                                | Same counter as `TextField`; `h-50`, not resizable by default.                                              |
| `PasswordField`            | password input             | the input props, without `type`                                                                                  | A button shows and hides the text (`aria-label` in pt-BR).                                                  |
| `ConfirmCodeField`         | 6-digit code               | the input props, without `type`, `maxLength`, `inputMode`, `pattern`                                             | Keeps only digits and cuts the value at 6.                                                                  |
| `NumberField`              | number input               | `min` (default `0`), `max` (HTML attribute only)                                                                 | The value is a number and never goes below `min`. Arrow keys and the wheel step it by 1.                    |
| `CentsField`               | number input in cents      | `min` (default `0`), `max` (HTML attribute only)                                                                 | Same as `NumberField`, and shows the formatted amount next to it (`1999` → `R$ 19,99`).                     |
| `SelectField`              | dropdown                   | `options` (`{ value, label, icon? }`), `placeholder`, `defaultValue`                                             | Options are data; the selected icon shows in the trigger.                                                   |
| `RadioField`               | radio group                | `values` (`{ value, label? }`), `defaultValue`, `variant` (`card` or `text`, default `card`)                     | One value at a time. Each option has its own id, so the same value in two forms doesn't clash.              |
| `CheckboxField`            | checkbox                   | `children` (the label, may hold links)                                                                           | A boolean value.                                                                                            |
| `TagsField`                | tag input                  | `maxTagCount` (5), `maxTagLength` (20), `minTagLength` (1), `hideTagsCounter`, `onDuplicateTags`, `onInvalidTag` | Enter or space adds a tag, Backspace on an empty input removes the last one. Tags are lowercase and unique. |
| `SimpleRelativeDatePicker` | amount and unit            | `min` (1), `max`, `defaultValue` (`{ number, unit }`)                                                            | The value is the ISO date of "now + amount". Units: `d`, `m`, `y`.                                          |
| `ColorPickerField`         | button that opens a dialog | `label`, `previousColor`, `disabled`, `className`                                                                | The value is a hex color or `null`. `previousColor` can be restored with one click.                         |
| `CropImageField`           | image picker with crop     | see the crop image section above                                                                                 | Choose, crop and confirm.                                                                                   |

Each control also has `aria-invalid` and `aria-describedby` set while its error
is shown (see the accessibility rule in [forms](../../../.agents/rules/web/react/forms.md)).

## Form and Field parts

- `Form`: `Form` (the `form` element, validates and submits), `Form.error`
  (submit error only), `Form.submitButton` (`disableOnDefaultValue`),
  `Form.popupSubmit` (floating bar with `label`, reset and submit).
- `Field`: `Field` (layout and the id of the field), `Field.label`
  (`required` shows a `*`), `Field.description`, `Field.error` (every non-submit
  error, shown after the field is touched).
- `StepForm`: multi-step forms, see the section above.

## Structure

Each component is a compound component in its own folder (`components/`, plus `context/` and `hooks/` where it needs them), laid out by
[the compound components rule](../../../.agents/rules/web/react/compound-components.md) and [the web lib structure rule](../../../.agents/rules/web/libraries/web-lib-structure.md).
`createAppForm` registers the fields; what the lib shares between components lives in `contexts/`, `hooks/`, `types/` and `utils/`.

## Memory

Check `.agents/memory/` before working here (testing setup).
