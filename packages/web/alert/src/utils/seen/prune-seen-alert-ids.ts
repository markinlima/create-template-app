import { readSeenAlertIds } from "./read-seen-alert-ids";
import { writeSeenAlertIds } from "./write-seen-alert-ids";

/**
 * Takes out of the browser the ids of alerts that are not in the list of alerts any more, so the storage doesn't grow forever with notices
 * that were removed or ended. Returns the ids that stay (the ones that are still in the list).
 * The list must be the whole list of alerts the app has now: an alert that is still loading would look removed and its "seen" would be lost.
 */
export function pruneSeenAlertIds(
  storageKey: string,
  currentIds: Iterable<string>,
): string[] {
  const current = new Set(currentIds);
  const stored = readSeenAlertIds(storageKey);
  const kept = stored.filter((id) => current.has(id));

  if (kept.length !== stored.length) {
    writeSeenAlertIds(storageKey, kept);
  }

  return kept;
}
