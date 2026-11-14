import type { InfiniteData } from "@tanstack/react-query";

import type { CursorPaginationMeta } from "@shared/routes/utils";

/**
 * Whether a cache holds a list that loads more as it scrolls (`useInfiniteQuery`): its items are in `pages`.
 *
 * @param data - What a query cache holds.
 */
export function isInfiniteList<T>(
  data: unknown,
): data is InfiniteData<{ items: T[]; meta: CursorPaginationMeta<string> }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "pages" in data &&
    Array.isArray(data.pages)
  );
}
