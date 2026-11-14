import type { InfiniteData } from "@tanstack/react-query";

/**
 * Joins the items of every page of an infinite query into one list.
 *
 * @param data - The data of an infinite query.
 * @returns The items of all the pages, in order.
 * @example
 * useInfiniteQuery({ ...options, select: flatUseQueryData });
 */
export function flatUseQueryData<T>(data: InfiniteData<{ items: T[] }>) {
  return data.pages.flatMap((page) => page.items);
}

/** Alias of {@link flatUseQueryData}, for `select`. */
export const select = flatUseQueryData;
