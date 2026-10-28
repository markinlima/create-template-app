import type { LucideIcon } from "lucide-react";
import { createContext, use } from "react";

export interface StepItem {
  id: string;
  icon: LucideIcon;
  label: string;
  hideOnProgressBar?: boolean;
  /** Disabled steps are skipped by `next`/`back` and hidden from the progress bar. @default true */
  enabled?: boolean;
}

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

export const StepFormContext = createContext<StepFormContextProps | null>(null);

export function useStepForm() {
  const context = use(StepFormContext);
  if (!context) {
    throw new Error("useStepForm deve ser usado dentro de um <StepForm>");
  }
  return context;
}
