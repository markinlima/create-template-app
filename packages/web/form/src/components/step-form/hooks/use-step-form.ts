import { use } from "react";

import { StepFormContext } from "../context/step-form-context";

/**
 * Read the state and the actions of the closest `<StepForm>`.
 *
 * @returns The steps, the current step and `next`, `back`, `goTo` and `setStepEnabled`.
 * @throws When used outside a `<StepForm>`.
 */
export function useStepForm() {
  const context = use(StepFormContext);
  if (!context) {
    throw new Error("useStepForm must be used inside a <StepForm>");
  }
  return context;
}
