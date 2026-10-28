/** The ids of the alerts already seen, kept in the browser. An unavailable or damaged storage reads as nothing seen. */
export function readSeenAlertIds(storageKey: string): string[] {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(storageKey) ?? "[]",
    );

    return Array.isArray(stored)
      ? stored.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}
