/**
 * Whether a cache holds infinite data (`pages`) or a list (`items`) instead of a single item.
 *
 * @param data - What a query cache holds.
 */
export function hasListShape(data: unknown) {
  return (
    typeof data === "object" &&
    data !== null &&
    ("pages" in data || "items" in data)
  );
}
