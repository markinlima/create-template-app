import { useEffect, useState } from "react";

import { useSeenAlerts } from "../../hooks/seen/use-seen-alerts";
import type { AlertItem } from "../../types/alert-item";
import type { AlertContentBase } from "../../types/content/alert-content";
import type { AnyAlertContentComponents } from "../../types/content/alert-content-components";
import { getPendingAlerts } from "../../utils/queue/get-pending-alerts";
import { AlertDialog } from "../dialog/alert-dialog";

interface AlertQueueProps {
  alerts: AlertItem<AlertContentBase>[];
  components: AnyAlertContentComponents;
  seenStorageKey?: string;
  onSeen?: (alert: AlertItem<AlertContentBase>) => void;
}

/** Decides which alerts the dialog shows, once, when it is known which ones were already seen. */
export function AlertQueue({
  alerts,
  components,
  seenStorageKey,
  onSeen,
}: AlertQueueProps) {
  // NOTE: every id counts as current, even without a component, so its "seen" is not lost
  const { seenIds, markSeen } = useSeenAlerts(
    seenStorageKey,
    alerts.map((alert) => alert.id),
  );
  const [queue, setQueue] = useState<AlertItem<AlertContentBase>[] | null>(
    null,
  );

  // NOTE: fixed at the first run, so late or newly seen alerts don't reshuffle an open dialog
  useEffect(() => {
    if (seenIds && !queue) {
      setQueue(
        getPendingAlerts({
          alerts,
          seenIds,
          renderableTypes: Object.keys(components),
        }),
      );
    }
  }, [seenIds, queue, alerts, components]);

  if (!queue || queue.length === 0) {
    return null;
  }

  function handleSeen(alert: AlertItem<AlertContentBase>) {
    markSeen(alert.id);
    onSeen?.(alert);
  }

  return (
    <AlertDialog alerts={queue} components={components} onSeen={handleSeen} />
  );
}
