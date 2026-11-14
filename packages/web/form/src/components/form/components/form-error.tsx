import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFormContext } from "../../../contexts/app-form-context";
import { getErrorMessage } from "../../../utils/get-error-message";

const DEFAULT_FORM_ERROR_MESSAGE = "Formulário inválido";

/**
 * Shows the form-level error of the submit (`errorMap.onSubmit`): the ones returned by the
 * form's `onSubmit` validators and the ones set when the `onSubmit` handler throws.
 * Errors from other validators (change, blur...) and field-level errors are ignored,
 * use `Field.error` for the latter.
 *
 * @param props - Props of the `p` element.
 * @remarks Must be rendered inside `<form.AppForm>`.
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
              "text-destructive mt-2 flex min-h-4 items-center text-xs font-bold",
              className,
            )}
            {...props}
          >
            {getErrorMessage(firstError, {
              fallback: DEFAULT_FORM_ERROR_MESSAGE,
            })}
          </p>
        );
      }}
    </form.Subscribe>
  );
}
