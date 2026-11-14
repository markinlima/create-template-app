import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFieldContext } from "../../../contexts/app-form-context";
import { useFieldAria } from "../../../hooks/use-field-aria";
import { getErrorMessage } from "../../../utils/get-error-message";
import { getVisibleFieldErrors } from "../../../utils/get-visible-field-errors";

const DEFAULT_FIELD_ERROR_MESSAGE = "Campo inválido";

/**
 * Shows the first error of the field, coming from any validator (change, blur, mount...)
 * except the submit ones, which are shown by `Form.error`.
 * The control points to it with `aria-describedby` while it is shown.
 *
 * @param props - Props of the `p` element.
 */
export function FieldError({
  className,
  ...props
}: ComponentPropsWithRef<"p">) {
  const field = useFieldContext();
  const { errorId } = useFieldAria();

  const errors = getVisibleFieldErrors(field.state.meta);

  if (!errors.length) {
    return null;
  }

  return (
    <p
      id={errorId}
      className={cn(
        "text-destructive mt-2 flex min-h-4 items-center text-xs font-bold",
        className,
      )}
      {...props}
    >
      {getErrorMessage(errors[0], { fallback: DEFAULT_FIELD_ERROR_MESSAGE })}
    </p>
  );
}
