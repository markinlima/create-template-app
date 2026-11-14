import { cn } from "tailwind-variants";

import { Button, type ButtonProps } from "@web/ui/button";
import { Card } from "@web/ui/card";

import { useFormContext } from "../../../contexts/app-form-context";
import { isSubmitBlocked } from "../../../utils/is-submit-blocked";

/** Props of {@link FormPopupSubmit}. */
export interface FormPopupSubmitProps
  extends Omit<ButtonProps, "type" | "disabled"> {
  /**
   * Also disable the button while the values are the default ones (nothing was changed yet).
   * @defaultValue false
   */
  disableOnDefaultValue?: boolean;
  /** Text of the floating bar, next to the buttons (e.g. "Você tem alterações não salvas"). */
  label: string;
}

/**
 * A floating bar that appears at the bottom of the screen once the form has changes that can be submitted.
 * It has a reset button and the submit button.
 *
 * @param props - See {@link FormPopupSubmitProps}.
 * @remarks Must be rendered inside `<form.AppForm>`.
 */
export function FormPopupSubmit({
  children,
  label,
  className,
  disableOnDefaultValue = false,
  ...props
}: FormPopupSubmitProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={({ canSubmit, isValid, isSubmitting, isDefaultValue }) => ({
        canSubmit,
        isValid,
        isSubmitting,
        isDefaultValue,
      })}
      children={(state) => {
        const canSubmitForm = !isSubmitBlocked(state) && !state.isDefaultValue;

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
                <Button raised variant="outline" onClick={() => form.reset()}>
                  Resetar
                </Button>
                <Button
                  {...props}
                  raised
                  className={cn("relative", className)}
                  disabled={isSubmitBlocked(state, { disableOnDefaultValue })}
                  type="submit"
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
