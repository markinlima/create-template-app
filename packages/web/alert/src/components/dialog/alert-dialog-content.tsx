import { Dialog } from "@web/ui/dialog";

import { useAlertQueue } from "../../hooks/queue/use-alert-queue";
import type { AnyAlertContentComponents } from "../../types/content/alert-content-components";
import { AlertHeading } from "./alert-heading";

interface AlertDialogContentProps {
  components: AnyAlertContentComponents;
}

/** The dialog around the alert on the screen: the heading and the component of its type, which draws the rest. */
export function AlertDialogContent({ components }: AlertDialogContentProps) {
  const queue = useAlertQueue();
  const { current, hasSeveral, canDismiss, isOpen, close, complete } = queue;
  const Content = components[current.content.type];

  function handleOpenChange(open: boolean) {
    // NOTE: the X, an outside click and Escape arrive here and close only a dismissible alert
    // NOTE: only this alert counts as seen; the rest comes back next time
    if (!open && canDismiss) {
      close();
    }
  }

  function handleOpenChangeComplete(open: boolean) {
    if (!open) {
      complete();
    }
  }

  if (!Content) {
    return null;
  }

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <Dialog.content
        hideCloseButton={!canDismiss}
        // NOTE: a fixed height with several alerts keeps the button in place between them
        className={
          hasSeveral
            ? "h-[90svh] max-h-[90svh] w-[calc(100%-2rem)] max-w-3xl"
            : "max-h-[90svh] w-[calc(100%-2rem)] max-w-3xl"
        }
      >
        <div
          key={current.id}
          className="animate-fade-in flex min-h-0 flex-1 flex-col gap-4"
        >
          <AlertHeading
            variant={current.content.variant}
            title={current.content.title}
          />
          <Content alert={current} content={current.content} />
        </div>
      </Dialog.content>
    </Dialog>
  );
}
