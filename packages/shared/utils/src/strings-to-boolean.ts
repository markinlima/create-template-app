export function stringsToBoolean(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value !== "string") {
      return [key, value];
    }

    const lowerValue = value.toLowerCase();

    if (lowerValue !== "true" && lowerValue !== "false") {
      return [key, value];
    }

    return [key, lowerValue === "true"];
  });

  return Object.fromEntries(entries);
}
