import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { useAlertQueue } from "../../hooks/queue/use-alert-queue";

/** Props of `AlertCenter.dots`: those of a `div`. */
export type AlertQueueDotsProps = ComponentProps<"div">;

/** One dot per alert of the queue, the current one marked. It only shows where the user is, it is not a control. Needs the alert dialog. */
export function AlertQueueDots({ className, ...props }: AlertQueueDotsProps) {
  const { alerts, index, total } = useAlertQueue();

  if (total <= 1) {
    return null;
  }

  return (
    <div
      role="img"
      aria-label={`Aviso ${index + 1} de ${total}`}
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      {alerts.map((alert, alertIndex) => (
        <span
          key={alert.id}
          className={cn(
            "size-2 rounded-full transition-colors",
            alertIndex === index ? "bg-primary" : "bg-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
