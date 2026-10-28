import { cn } from "tailwind-variants";

import { useStepForm } from "../../context/step-form-context";

export function StepFormProgress() {
  const { currentStep, activeSteps, totalVisualSteps } = useStepForm();
  const progressPercentage = (currentStep / totalVisualSteps) * 100;

  return (
    <div className="relative flex w-75 items-center justify-around overflow-hidden">
      {activeSteps
        .filter(({ hideOnProgressBar }) => !hideOnProgressBar)
        .map(({ id, icon: Icon, label }, index) => {
          const currentStepBall = index + 1;
          return (
            <div
              className="z-10 flex flex-1 flex-col items-center gap-2"
              key={id}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 border-accent bg-background text-foreground transition-colors",
                  {
                    "border-primary text-primary":
                      currentStepBall <= currentStep,
                  },
                )}
              >
                <Icon className="size-4" />
              </div>
              <p className="text-muted-foreground text-xs">{label}</p>
            </div>
          );
        })}
      <div className="absolute top-4 left-0 h-1 w-full -translate-y-1/2 rounded-full bg-accent">
        <div
          className="h-full max-w-full rounded-full bg-primary transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
