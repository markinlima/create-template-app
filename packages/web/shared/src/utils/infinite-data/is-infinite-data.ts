import type { InfiniteData } from "@tanstack/react-query";

/**
 * Whether a cache holds infinite data (`pages`).
 *
 * @param data - What a query cache holds.
 */
export function isInfiniteData(
  data: unknown,
): data is InfiniteData<{ items: unknown[] }> {
  return typeof data === "object" && data !== null && "pages" in data;
}
