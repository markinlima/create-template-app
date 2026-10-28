import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";
import { FieldRoot } from "./field-root";

export const Field = Object.assign(FieldRoot, {
  label: FieldLabel,
  error: FieldError,
  description: FieldDescription,
});
