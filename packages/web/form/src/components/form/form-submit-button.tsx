import { cn } from "tailwind-variants";

import { Button, type ButtonProps } from "@web/ui/button";

import { useFormContext } from "../../context/app-form-context";

interface FormSubmitButtonProps extends ButtonProps {
  disableOnDefaultValue?: boolean;
}

export function FormSubmitButton({
  children,
  className,
  disableOnDefaultValue = false,
  ...props
}: FormSubmitButtonProps) {
  const Form = useFormContext();

  return (
    <Form.Subscribe
      selector={({ canSubmit, isValid, isSubmitting, isDefaultValue }) => {
        return { canSubmit, isValid, isSubmitting, isDefaultValue };
      }}
      children={({ canSubmit, isValid, isSubmitting, isDefaultValue }) => {
        return (
          <Button
            className={cn("relative", className)}
            disabled={
              !canSubmit ||
              !isValid ||
              isSubmitting ||
              (disableOnDefaultValue && isDefaultValue)
            }
            type="submit"
            {...props}
          >
            {children}
          </Button>
        );
      }}
    />
  );
}
