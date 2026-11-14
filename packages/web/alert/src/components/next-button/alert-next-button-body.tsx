import { Button, type ButtonProps } from "@web/ui/button";

import { useAlertCooldown } from "../../hooks/next-button/use-alert-cooldown";
import { useAlertQueue } from "../../hooks/queue/use-alert-queue";
import { getAlertButtonLabel } from "../../utils/next-button/get-alert-button-label";
import { getAlertCooldown } from "../../utils/next-button/get-alert-cooldown";

/** Props of the next button: those of a `Button`, and its own cooldown. */
export interface AlertNextButtonBodyProps extends ButtonProps {
  /** Seconds the button waits before it works, over the one of the importance of the alert. */
  cooldownSeconds?: number;
}

/** The button itself. It is mounted again for each alert (the cooldown counts from when it is mounted). */
export function AlertNextButtonBody({
  cooldownSeconds,
  onClick,
  disabled,
  children,
  ...props
}: AlertNextButtonBodyProps) {
  const { current, isLast, hasSeveral, isRevisit, next } = useAlertQueue();
  const remainingSeconds = useAlertCooldown(
    getAlertCooldown({
      importance: current.content.importance,
      cooldownSeconds,
      isRevisit,
    }),
  );

  return (
    <Button
      raised
      {...props}
      disabled={disabled || remainingSeconds > 0}
      onClick={(event) => {
        onClick?.(event);

        // NOTE: a handler that prevents the default takes over the advance (e.g. a form that saves first)
        if (!event.defaultPrevented) {
          next();
        }
      }}
    >
      {children ?? getAlertButtonLabel({ isLast, hasSeveral })}
      {remainingSeconds > 0 ? ` (${remainingSeconds}s)` : ""}
    </Button>
  );
}
