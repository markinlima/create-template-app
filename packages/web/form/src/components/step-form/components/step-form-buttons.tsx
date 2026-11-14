import { Button } from "@web/ui/button";

import {
  useFieldContext,
  useFormContext,
} from "../../../contexts/app-form-context";
import { useStepForm } from "../hooks/use-step-form";

interface StepFormButtonsProps {
  /**
   * Text of the button on the last step.
   * @defaultValue "Entrar"
   */
  lastButtonText?: string;
  /** Disables the buttons, e.g. while the form submits. */
  disabled?: boolean;
}
/** The back and next buttons of the current step; the last step shows `lastButtonText`. */
export function StepFormButtons({
  lastButtonText = "Entrar",
  disabled,
}: StepFormButtonsProps) {
  const { back, isFirstStep, isLastVisualStep } = useStepForm();
  const form = useFormContext();
  const field = useFieldContext();
  const isFieldValid = field.state.meta.isValid;
  const fieldValue = field.state.value;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Button raised disabled={isFirstStep} onClick={back} variant="outline">
        Voltar
      </Button>
      <form.Subscribe
        selector={({ isSubmitting, isValidating }) => {
          return {
            isFormSubmitting: isSubmitting,
            isFormValidating: isValidating,
          };
        }}
        children={({ isFormSubmitting, isFormValidating }) => {
          const isDisabled =
            isFormSubmitting ||
            isFormValidating ||
            !isFieldValid ||
            !fieldValue ||
            disabled;
          return (
            <Button raised disabled={isDisabled} type="submit">
              {isLastVisualStep ? lastButtonText : "Próximo"}
            </Button>
          );
        }}
      />
    </div>
  );
}
