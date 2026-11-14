import type { AlertItem } from "../../types/alert-item";
import type { AlertContentBase } from "../../types/content/alert-content";
import type { AnyAlertContentComponents } from "../../types/content/alert-content-components";
import { AlertQueueProvider } from "../queue/alert-queue-provider";
import { AlertDialogContent } from "./alert-dialog-content";

interface AlertDialogProps {
  /** The alerts to show, in order. The list must not change while the dialog is open. */
  alerts: AlertItem<AlertContentBase>[];
  /** The component of each content type. Every alert of the list must have one. */
  components: AnyAlertContentComponents;
  /** Called when an alert was seen: its button was used, or it was closed. */
  onSeen: (alert: AlertItem<AlertContentBase>) => void;
}

/**
 * The alerts in one dialog that stays open from one alert to the next, so it doesn't close and open again. What is inside each alert is
 * drawn by the component of its content type. An alert can only be closed before the end the ways its importance allows.
 */
export function AlertDialog({ alerts, components, onSeen }: AlertDialogProps) {
  return (
    <AlertQueueProvider alerts={alerts} onSeen={onSeen}>
      <AlertDialogContent components={components} />
    </AlertQueueProvider>
  );
}
