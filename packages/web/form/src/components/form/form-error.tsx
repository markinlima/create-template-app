import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFormContext } from "../../context/app-form-context";

const DEFAULT_FORM_ERROR_MESSAGE = "Formulário inválido";

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
  return DEFAULT_FORM_ERROR_MESSAGE;
}

/**
 * Shows the form-level error of the submit (`errorMap.onSubmit`): the ones returned by the
 * form's `onSubmit` validators and the ones set when the `onSubmit` handler throws.
 * Errors from other validators (change, blur...) and field-level errors are ignored,
 * use `Field.error` for the latter.
 */
export function FormError({ className, ...props }: ComponentPropsWithRef<"p">) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(submitError) => {
        const firstError = Array.isArray(submitError)
          ? submitError.find(Boolean)
          : submitError;

        if (!firstError) {
          return null;
        }

        return (
          <p
            role="alert"
            className={cn(
              "mt-2 flex min-h-4 items-center font-bold text-destructive text-xs",
              className,
            )}
            {...props}
          >
            {getErrorMessage(firstError)}
          </p>
        );
      }}
    </form.Subscribe>
  );
}
