---

paths:

- "apps/web/**"
- "packages/web/form/**"

---

# Forms

Forms are built with the `form` lib (`@web/form`), on top of TanStack Form's
`createFormHook`. Don't call `useForm` from `@tanstack/react-form` directly and
don't add another form library.

- **The app creates its hooks once** with `createAppForm` from `@web/form`,
  passing the app's own field components (`fieldComponents`) and form
  components (`formComponents`). It returns `useAppForm` and `withForm`.
  The built-in fields (`TextField`, `PasswordField`, `SelectField`, ...) are
  already registered.
- **Validate with the Zod schema of the endpoint**, the same one the backend
  validates, as `validators` (`onChange`, `onSubmit` or `onMount`). Infer the
  value type from that schema, don't write it by hand.
- **Render fields** with `<form.AppField name=… children={(field) => …} />`,
  using the registered field components (`field.TextField`,
  `field.PasswordField`, ...). Lay each one out with the `Field` compound:
  `Field.label`, `Field.description`, `Field.error`, inside `Field`.
- **The form itself** is `Form` (`Form.submitButton`, `Form.error`,
  `Form.popupSubmit`). `Form.error` and the submit button read the form
  context, so render them inside `<form.AppForm>`.
- **The lib holds only the generic parts.** `@web/form` has the fields and
  forms that any app can use (text, select, OTP, crop image...). Forms and
  fields of the project (a login, a comment, a feed filter, a field that only
  this app knows) live **in the app**, in the module that owns them (its
  `components/`, see [folder-structure](../structure/folder-structure.md)), and
  they never go into the lib, even
  when they look generic at first. Move one to the lib only when a second app
  needs it.
- **New field type** of the project: pass it in
  `createAppForm({ fieldComponents })`, in the app's `form/lib`, and it is
  available as `field.<Name>` in every form.
- **New field type** that every app can use: add it to
  `packages/web/form/src/components/fields/`, read the state with
  `useFieldContext`, use `useFieldAria` for the ids and the aria attributes, and
  register it in the lib.
- **Reusable group of fields** (an address, a date range): build it with
  `withFieldGroup` in the module, not by copying the fields in each form.
- **Dependent fields** (a field that changes when another one changes, such as
  a city that depends on the state): use `listeners` on the field that
  changes, instead of reading the value in the component.
- **Transform**: `onSubmit` receives the values of the inputs (strings for
  text, the value as the control holds it). Parse them with the same Zod schema
  in `onSubmit` to get the output the API expects (a number, a date, a trimmed
  string); don't convert them by hand in each field.
- **Accessibility**: every built-in control gets its id from `Field` and
  `aria-invalid` and `aria-describedby` while its error is shown, through
  `useFieldAria`. Each label is linked with `Field.label`, and each error is
  shown with `Field.error` inside the same `Field`. A custom control does the
  same, and doesn't take `aria-invalid` from the consuming code.
- **Focus on submit**: when the submit is refused, `Form` moves the focus to the
  first control marked `aria-invalid="true"`, so that control must be focusable.
- **Submit** with the generated mutation's `mutateAsync`. Don't add an error
  toast: API errors are already toasted by the query client's global handler.
  An error thrown by `onSubmit` that is not an API error is shown by `Form.error`,
  through the `getSubmitErrorMessage` option of `createAppForm`.
- **Multi-step forms** use `StepForm` and `useStepForm` from the lib.
- Labels, descriptions, placeholders and error messages are pt-BR.
