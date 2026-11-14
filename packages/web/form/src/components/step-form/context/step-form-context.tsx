import type { LucideIcon } from "lucide-react";
import { createContext } from "react";

/** A step of a multi-step form. */
export interface StepItem {
  /** Identifies the step; `StepForm.step` uses it as `stepId`. */
  id: string;
  /** Icon shown for the step on the progress bar. */
  icon: LucideIcon;
  /** Text shown for the step on the progress bar. */
  label: string;
  /** The step counts but is not drawn on the progress bar. */
  hideOnProgressBar?: boolean;
  /** Disabled steps are skipped by `next`/`back` and hidden from the progress bar. @defaultValue true */
  enabled?: boolean;
}

/** What a `<StepForm>` shares with its parts. */
export interface StepFormContextProps {
  /** Every declared step, including the disabled ones. */
  steps: StepItem[];
  /** Only the enabled steps, in order. */
  activeSteps: StepItem[];
  currentStepId: string;
  /** 1-based position of the current step among the enabled ones. */
  currentStep: number;
  totalSteps: number;
  totalVisualSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLastVisualStep: boolean;
  /** Goes to the next enabled step. Does nothing on the last one. */
  next: () => void;
  /** Goes to the previous enabled step. Does nothing on the first one. */
  back: () => void;
  goTo: (id: string) => void;
  /** Overrides the `enabled` flag of a step. Pass `undefined` to go back to the declared value. */
  setStepEnabled: (id: string, enabled: boolean | undefined) => void;
}

/** Context of a `<StepForm>`; read it through `useStepForm`. */
export const StepFormContext = createContext<StepFormContextProps | null>(null);
