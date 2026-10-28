import { type ComponentPropsWithRef, type SubmitEvent, useEffect } from "react";

import { useFormContext } from "../../context/app-form-context";
import {
  type StepFormContextProps,
  useStepForm,
} from "../../context/step-form-context";

export interface StepFormStepActions
  extends Pick<
    StepFormContextProps,
    "next" | "back" | "goTo" | "isFirstStep" | "isLastStep"
  > {
  /** Submits the whole form (runs the form's validators and `onSubmit`). */
  submit: () => Promise<void>;
}

interface StepFormStepProps
  extends Omit<ComponentPropsWithRef<"form">, "onSubmit"> {
  /** Id of the step, as declared in the steps list. */
  stepId: string;
  /** Overrides the `enabled` flag declared in the steps list, e.g. to only ask for an extra step when needed. */
  enabled?: boolean;
  /**
   * Runs when the step's `<form>` is submitted (Enter or a `type="submit"` button inside it).
   * Default: go to the next step, or submit the form when this is the last one.
   * When provided it replaces the default, call `next`, `goTo` or `submit` yourself.
   */
  onStepSubmit?: (actions: StepFormStepActions) => void | Promise<void>;
}

/**
 * Wraps one step of a multi-step form in its own `<form>`, rendered only while the step is active.
 * Must be rendered inside `<form.AppForm>`.
 */
export function StepFormStep({
  stepId,
  enabled,
  onStepSubmit,
  children,
  ...props
}: StepFormStepProps) {
  const {
    currentStepId,
    setStepEnabled,
    next,
    back,
    goTo,
    isFirstStep,
    isLastStep,
  } = useStepForm();
  const form = useFormContext();

  useEffect(() => {
    if (enabled === undefined) {
      return;
    }
    setStepEnabled(stepId, enabled);
    return () => setStepEnabled(stepId, undefined);
  }, [stepId, enabled, setStepEnabled]);

  if (currentStepId !== stepId) {
    return null;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const submit = () => form.handleSubmit();

    if (onStepSubmit) {
      await onStepSubmit({ next, back, goTo, isFirstStep, isLastStep, submit });
      return;
    }

    if (isLastStep) {
      await submit();
      return;
    }

    next();
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
