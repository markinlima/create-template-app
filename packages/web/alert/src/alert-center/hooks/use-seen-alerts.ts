import { useCallback, useEffect, useState } from "react";

import { readSeenAlertIds } from "../utils/read-seen-alert-ids";
import { writeSeenAlertIds } from "../utils/write-seen-alert-ids";

/**
 * The alerts already seen. With a `storageKey` they are remembered in the browser (so an alert is only ever seen once);
 * without one they are remembered until the page is closed. `seenIds` is `null` until the browser's storage was read, so
 * nothing is shown before it is known what was already seen.
 */
export function useSeenAlerts(storageKey?: string) {
  const [seenIds, setSeenIds] = useState<ReadonlySet<string> | null>(
    storageKey ? null : new Set(),
  );

  useEffect(() => {
    setSeenIds(new Set(storageKey ? readSeenAlertIds(storageKey) : []));
  }, [storageKey]);

  const markSeen = useCallback(
    (id: string) => {
      setSeenIds((current) => {
        const next = new Set(current).add(id);

        // ? Writing is idempotent, so it is safe even if React runs this updater twice (Strict Mode).

        if (storageKey) {
          writeSeenAlertIds(storageKey, next);
        }

        return next;
      });
    },
    [storageKey],
  );

  return { seenIds, markSeen };
}
