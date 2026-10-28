import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Button } from "@web/ui/button";
import { Card } from "@web/ui/card";

import { useFormContext } from "../../context/app-form-context";

interface FormPopupSubmitProps extends ComponentProps<typeof Button> {
  disableOnDefaultValue?: boolean;
  label: string;
}

export function FormPopupSubmit({
  children,
  label,
  className,
  disableOnDefaultValue = false,
  ...props
}: FormPopupSubmitProps) {
  const Form = useFormContext();

  return (
    <Form.Subscribe
      selector={(state) => [
        state.canSubmit,
        state.isValid,
        state.isSubmitting,
        state.isDefaultValue,
      ]}
      children={([canSubmit, isValid, isSubmitting, isDefaultValue]) => {
        const isDisabled =
          !canSubmit ||
          !isValid ||
          isSubmitting ||
          (disableOnDefaultValue && isDefaultValue);
        const canSubmitForm =
          canSubmit && isValid && !isSubmitting && !isDefaultValue;

        return (
          <Card
            className={cn(
              "fixed bottom-10 left-1/2 z-50 hidden w-full max-w-2xl -translate-x-1/2",
              {
                flex: canSubmitForm,
              },
            )}
          >
            <Card.content className="flex items-center justify-between">
              <p className="font-bold max-md:text-sm">{label}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => Form.reset()}>
                  Resetar
                </Button>
                <Button
                  className={cn("relative", className)}
                  disabled={isDisabled}
                  type="submit"
                  {...props}
                >
                  {children}
                </Button>
              </div>
            </Card.content>
          </Card>
        );
      }}
    />
  );
}
