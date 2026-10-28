/** Keeps the ids of the alerts already seen in the browser. A storage that fails (full, blocked) is ignored: the alert shows again. */
export function writeSeenAlertIds(storageKey: string, ids: Iterable<string>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...ids]));
  } catch {
    // ? Not being able to remember only means the alert comes back, which is better than breaking the app.
  }
}
