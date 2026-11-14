import { use } from "react";

import { useFieldContext } from "../contexts/app-form-context";
import { FieldIdContext } from "../contexts/field-id-context";
import { getVisibleFieldErrors } from "../utils/get-visible-field-errors";

/**
 * The ids and aria attributes that link a control with its label and its error.
 */
export interface FieldAria {
  /** Id of the control. Set it on the control and as `htmlFor` of the label. */
  id: string;
  /** Id of the error message, rendered by `Field.error`. */
  errorId: string;
  /** `aria-invalid` and `aria-describedby`, set only while an error is shown. Spread them on the control. */
  invalidProps: {
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  };
}

/**
 * Gives a control the ids and aria attributes of its field. Use it in every built-in control.
 *
 * @returns See {@link FieldAria}.
 * @remarks The id comes from `Field`. Outside a `Field` it falls back to the field name, so the label and the error must be inside a `Field` to link to the control.
 */
export function useFieldAria(): FieldAria {
  const field = useFieldContext();
  const fieldId = use(FieldIdContext);
  const id = fieldId ?? field.name;
  const errorId = `${id}-error`;
  const hasError = getVisibleFieldErrors(field.state.meta).length > 0;

  return {
    id,
    errorId,
    invalidProps: {
      "aria-invalid": hasError,
      "aria-describedby": hasError ? errorId : undefined,
    },
  };
}
