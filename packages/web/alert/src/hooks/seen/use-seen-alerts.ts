import { useCallback, useEffect, useState } from "react";

import { pruneSeenAlertIds } from "../../utils/seen/prune-seen-alert-ids";
import { readSeenAlertIds } from "../../utils/seen/read-seen-alert-ids";
import { writeSeenAlertIds } from "../../utils/seen/write-seen-alert-ids";

/**
 * The alerts already seen. With a `storageKey` they are remembered in the browser (so an alert is only ever seen once);
 * without one they are remembered until the page is closed. `seenIds` is `null` until the browser's storage was read, so
 * nothing is shown before it is known what was already seen.
 * With `currentIds` (every id the app has now) the ids saved in the browser that are not there any more are taken out of it, so the storage
 * doesn't pile up notices that were removed or ended. Pass the whole list, never one that is still loading.
 */
export function useSeenAlerts(
  storageKey?: string,
  currentIds?: readonly string[],
) {
  const [seenIds, setSeenIds] = useState<ReadonlySet<string> | null>(
    storageKey ? null : new Set(),
  );

  // NOTE: the ids as one string, since a new array with the same ids is not a new list
  const currentIdsKey = currentIds?.join("\n");

  useEffect(() => {
    if (!storageKey) {
      setSeenIds(new Set());
      return;
    }

    setSeenIds(
      new Set(
        currentIdsKey === undefined
          ? readSeenAlertIds(storageKey)
          : pruneSeenAlertIds(storageKey, currentIdsKey.split("\n")),
      ),
    );
  }, [storageKey, currentIdsKey]);

  const markSeen = useCallback(
    (id: string) => {
      setSeenIds((current) => {
        const next = new Set(current).add(id);

        // NOTE: writing is idempotent, so a second run of this updater (Strict Mode) is safe

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
