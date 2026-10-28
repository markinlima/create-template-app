import { StepFormButtons } from "./step-form-buttons";
import { StepFormProgress } from "./step-form-progress";
import { StepFormRoot } from "./step-form-root";
import { StepFormStep } from "./step-form-step";

export type { StepFormStepActions } from "./step-form-step";

// ? `step` and `buttons` read the form context, so they must be rendered inside `<form.AppForm>`.
export const StepForm = Object.assign(StepFormRoot, {
  step: StepFormStep,
  buttons: StepFormButtons,
  progress: StepFormProgress,
});
