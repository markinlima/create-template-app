import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFieldContext } from "../../context/app-form-context";

const DEFAULT_FIELD_ERROR_MESSAGE = "Campo inválido";

function getErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return DEFAULT_FIELD_ERROR_MESSAGE;
}

/**
 * Shows the first error of the field, coming from any validator (change, blur, mount...)
 * except the submit ones, which are shown by `Form.error`.
 */
export function FieldError({
  className,
  ...props
}: ComponentPropsWithRef<"p">) {
  const field = useFieldContext();
  const isTouched = field.state.meta.isTouched;

  const { onSubmit: _submitError, ...nonSubmitErrorMap } =
    field.state.meta.errorMap;
  const errors = Object.values(nonSubmitErrorMap).flat().filter(Boolean);

  if (!isTouched || !errors.length) {
    return null;
  }

  return (
    <p
      className={cn(
        "mt-2 flex min-h-4 items-center font-bold text-destructive text-xs",
        className,
      )}
      {...props}
    >
      {getErrorMessage(errors[0])}
    </p>
  );
}
