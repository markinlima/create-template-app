/**
 * Whether a cache holds a list (`items`).
 *
 * @param data - What a query cache holds.
 */
export function isList(data: unknown): data is { items: unknown[] } {
  return typeof data === "object" && data !== null && "items" in data;
}
