import { cn } from "tailwind-variants";

import { Button, type ButtonProps } from "@web/ui/button";

import { useFormContext } from "../../../contexts/app-form-context";
import { isSubmitBlocked } from "../../../utils/is-submit-blocked";

/** Props of {@link FormSubmitButton}. */
export interface FormSubmitButtonProps
  extends Omit<ButtonProps, "type" | "disabled"> {
  /**
   * Also disable the button while the values are the default ones (nothing was changed yet).
   * @defaultValue false
   */
  disableOnDefaultValue?: boolean;
}

/**
 * The submit button of the form. It is disabled while the form can't be submitted.
 *
 * @param props - See {@link FormSubmitButtonProps}.
 * @remarks Must be rendered inside `<form.AppForm>`.
 */
export function FormSubmitButton({
  children,
  className,
  disableOnDefaultValue = false,
  ...props
}: FormSubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={({ canSubmit, isValid, isSubmitting, isDefaultValue }) => ({
        canSubmit,
        isValid,
        isSubmitting,
        isDefaultValue,
      })}
      children={(state) => (
        <Button
          {...props}
          className={cn("relative", className)}
          disabled={isSubmitBlocked(state, { disableOnDefaultValue })}
          type="submit"
        >
          {children}
        </Button>
      )}
    />
  );
}
