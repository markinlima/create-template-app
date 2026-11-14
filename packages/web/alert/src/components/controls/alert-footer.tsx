import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Dialog } from "@web/ui/dialog";

import { useAlertQueue } from "../../hooks/queue/use-alert-queue";
import { AlertQueueDots } from "./alert-queue-dots";

/** Props of `AlertCenter.footer`: those of the dialog footer. */
export type AlertFooterProps = ComponentProps<typeof Dialog.footer>;

/** The footer of an alert: the dots of the queue on the left and its `children` (the buttons) on the right. Needs the alert dialog. */
export function AlertFooter({
  className,
  children,
  ...props
}: AlertFooterProps) {
  const { current, hasSeveral, index, total } = useAlertQueue();

  return (
    <Dialog.footer
      className={cn("flex-col sm:flex-col sm:justify-start", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AlertQueueDots />
        {/* NOTE: read aloud when the alert changes; the dots are only a picture */}
        {!!hasSeveral && (
          <p className="sr-only" aria-live="polite">
            {`Aviso ${index + 1} de ${total}: ${current.content.title}`}
          </p>
        )}
        {/* NOTE: flex-wrap sends a long button text to its own line on a narrow screen */}
        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
          {children}
        </div>
      </div>
    </Dialog.footer>
  );
}
