import { useEffect, useState } from "react";

import { useSeenAlerts } from "../hooks/use-seen-alerts";
import type { AlertItem } from "../types/alert-item";
import { getPendingAlerts } from "../utils/get-pending-alerts";
import { AlertDialog } from "./alert-dialog";

interface AlertQueueProps {
  alerts: AlertItem[];
  seenStorageKey?: string;
  onSeen?: (alert: AlertItem) => void;
}

/** Decides which alerts the dialog shows, once, when it is known which ones were already seen. */
export function AlertQueue({
  alerts,
  seenStorageKey,
  onSeen,
}: AlertQueueProps) {
  const { seenIds, markSeen } = useSeenAlerts(seenStorageKey);
  const [queue, setQueue] = useState<AlertItem[] | null>(null);

  // ? Fixed on the first time: alerts that arrive or are seen later don't reshuffle a dialog that is open, they wait for the next time.
  useEffect(() => {
    if (seenIds && !queue) {
      setQueue(getPendingAlerts({ alerts, seenIds }));
    }
  }, [seenIds, queue, alerts]);

  if (!queue || queue.length === 0) {
    return null;
  }

  function handleSeen(alert: AlertItem) {
    markSeen(alert.id);
    onSeen?.(alert);
  }

  return <AlertDialog alerts={queue} onSeen={handleSeen} />;
}
