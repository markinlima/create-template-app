export function emptyStringsToUndefined(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const entries = Object.entries(obj).map(([key, value]) => {
    if (value === "") {
      return [key, undefined];
    }

    return [key, value];
  });

  return Object.fromEntries(entries);
}
