/**
 * Whether a cache holds a list that is read once (`useQuery`, the preview of a profile): its items are in `items`.
 *
 * @param data - What a query cache holds.
 */
export function isPlainList<T>(data: unknown): data is { items: T[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray(data.items)
  );
}
