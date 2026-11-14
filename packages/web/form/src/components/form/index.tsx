import { FormError } from "./components/form-error";
import { FormPopupSubmit } from "./components/form-popup-submit";
import { FormRoot } from "./components/form-root";
import { FormSubmitButton } from "./components/form-submit-button";

// NOTE: `error`, `submitButton` and `popupSubmit` read the form context, so they must be rendered inside `<form.AppForm>`.
/** The form: its `error`, `submitButton` and `popupSubmit` parts. */
export const Form = Object.assign(FormRoot, {
  error: FormError,
  submitButton: FormSubmitButton,
  popupSubmit: FormPopupSubmit,
});
