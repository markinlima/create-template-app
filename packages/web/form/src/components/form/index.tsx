import { FormError } from "./form-error";
import { FormPopupSubmit } from "./form-popup-submit";
import { FormRoot } from "./form-root";
import { FormSubmitButton } from "./form-submit-button";

// ? `error`, `submitButton` and `popupSubmit` read the form context, so they must be rendered inside `<form.AppForm>`.
export const Form = Object.assign(FormRoot, {
  error: FormError,
  submitButton: FormSubmitButton,
  popupSubmit: FormPopupSubmit,
});
