import type { ReactNode } from "react";

import { AlertQueueContext } from "../../contexts/alert-queue-context";
import type { UseAlertQueueStateOptions } from "../../hooks/queue/use-alert-queue-state";
import { useAlertQueueState } from "../../hooks/queue/use-alert-queue-state";

interface AlertQueueProviderProps extends UseAlertQueueStateOptions {
  children: ReactNode;
}

/** Holds the queue of the dialog and shares it with everything inside, through `useAlertQueue`. Draws nothing once the dialog is done. */
export function AlertQueueProvider({
  alerts,
  onSeen,
  children,
}: AlertQueueProviderProps) {
  const queue = useAlertQueueState({ alerts, onSeen });

  if (!queue) {
    return null;
  }

  return <AlertQueueContext value={queue}>{children}</AlertQueueContext>;
}
