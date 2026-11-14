import { StepFormButtons } from "./components/step-form-buttons";
import { StepFormProgress } from "./components/step-form-progress";
import { StepFormRoot } from "./components/step-form-root";
import { StepFormStep } from "./components/step-form-step";

export type { StepFormStepActions } from "./components/step-form-step";

// NOTE: `step` and `buttons` read the form context, so they must be rendered inside `<form.AppForm>`.
/** A multi-step form: the `progress`, the `step`s and the `buttons`. */
export const StepForm = Object.assign(StepFormRoot, {
  step: StepFormStep,
  buttons: StepFormButtons,
  progress: StepFormProgress,
});
