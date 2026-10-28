export function trimStrings(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, value.trim()];
    }

    return [key, value];
  });

  return Object.fromEntries(entries);
}
