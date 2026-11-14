import { FieldDescription } from "./components/field-description";
import { FieldError } from "./components/field-error";
import { FieldLabel } from "./components/field-label";
import { FieldRoot } from "./components/field-root";

/** A form field: the label, the control, the description and the error, with the ids and aria links set up. */
export const Field = Object.assign(FieldRoot, {
  label: FieldLabel,
  error: FieldError,
  description: FieldDescription,
});
