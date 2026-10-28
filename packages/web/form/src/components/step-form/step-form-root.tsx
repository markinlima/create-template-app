import { type ReactNode, useState } from "react";

import {
  StepFormContext,
  type StepFormContextProps,
  type StepItem,
} from "../../context/step-form-context";

interface StepFormRootProps {
  children: ReactNode;
  steps: StepItem[];
  /** Id of the first step shown. @default the first enabled step */
  initialStepId?: string;
}

export function StepFormRoot({
  steps,
  initialStepId,
  children,
}: StepFormRootProps) {
  const [enabledOverrides, setEnabledOverrides] = useState<
    Record<string, boolean>
  >({});

  const isEnabled = (step: StepItem) =>
    enabledOverrides[step.id] ?? step.enabled ?? true;
  const activeSteps = steps.filter(isEnabled);

  const [currentStepId, setCurrentStepId] = useState<string>(
    initialStepId ?? activeSteps[0]?.id ?? "",
  );

  const currentIndex = activeSteps.findIndex(
    (step) => step.id === currentStepId,
  );
  const totalSteps = activeSteps.length;
  const totalVisualSteps = activeSteps.filter(
    ({ hideOnProgressBar }) => !hideOnProgressBar,
  ).length;
  const currentStep = currentIndex + 1;
  const isFirstStep = currentIndex <= 0;
  const isLastStep = currentIndex === totalSteps - 1;

  function next() {
    const nextStep = activeSteps[currentIndex + 1];
    if (nextStep) {
      setCurrentStepId(nextStep.id);
    }
  }

  function back() {
    const previousStep = activeSteps[currentIndex - 1];
    if (previousStep) {
      setCurrentStepId(previousStep.id);
    }
  }

  function goTo(id: string) {
    if (!steps.some((step) => step.id === id)) {
      console.log(`Invalid step: "${id}"`);
      return;
    }
    setCurrentStepId(id);
  }

  function setStepEnabled(id: string, enabled: boolean | undefined) {
    setEnabledOverrides((previous) => {
      if (enabled === undefined) {
        const { [id]: _removed, ...rest } = previous;
        return rest;
      }
      return previous[id] === enabled
        ? previous
        : { ...previous, [id]: enabled };
    });
  }

  const value: StepFormContextProps = {
    steps,
    activeSteps,
    currentStepId,
    currentStep,
    totalSteps,
    totalVisualSteps,
    isFirstStep,
    isLastStep,
    isLastVisualStep: currentStep === totalVisualSteps,
    next,
    back,
    goTo,
    setStepEnabled,
  };

  return <StepFormContext value={value}>{children}</StepFormContext>;
}
