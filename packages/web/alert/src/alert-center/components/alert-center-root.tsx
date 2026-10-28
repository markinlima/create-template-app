import type { AlertItem } from "../types/alert-item";
import { AlertQueue } from "./alert-queue";

export interface AlertCenterRootProps {
  /** The alerts that exist. The ones already seen are skipped. */
  alerts: AlertItem[];
  /** Where the ids of the seen alerts are kept in the browser. Use one per user. Without it they are only kept until the page closes. */
  seenStorageKey?: string;
  /** Called when an alert was seen, e.g. to tell the API. */
  onSeen?: (alert: AlertItem) => void;
}

/** Shows the alerts not seen yet in one dialog, page by page: the most important first, each only once. Place it once, high in the tree. */
export function AlertCenterRoot({
  alerts,
  seenStorageKey,
  onSeen,
}: AlertCenterRootProps) {
  // ? A new key (another user) starts over: it is a different set of seen alerts.
  return (
    <AlertQueue
      key={seenStorageKey ?? "session"}
      alerts={alerts}
      seenStorageKey={seenStorageKey}
      onSeen={onSeen}
    />
  );
}
