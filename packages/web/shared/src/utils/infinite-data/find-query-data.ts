import type { QueryClient } from "@tanstack/react-query";

import type { OpenApiTag } from "@shared/routes/models";

import { isInfiniteData } from "./is-infinite-data";
import { isList } from "./is-list";
import { matchesItem } from "./matches-item";

/** Options of {@link findQueryData}. */
export interface FindQueryDataOptions<T> {
  /** The query client that holds the caches. */
  queryClient: QueryClient;
  /** The key of the caches to look in. */
  queryKey: Readonly<[OpenApiTag, ...unknown[]]>;
  /** Tells whether an item is the one looked for. */
  where: (data: Readonly<T>) => boolean;
}

/**
 * Finds the first item that matches `where` in the caches under `queryKey`: feeds (infinite data), lists and single
 * items. Use it to read what an item looked like before a mutation changes the cache (e.g. to know what a deleted item
 * belonged to).
 *
 * @param options - See {@link FindQueryDataOptions}.
 * @returns The item, or `undefined` when none matches.
 * @example
 * const post = findQueryData<Post>({ queryClient, queryKey: ["Post"], where: (p) => p.id === id });
 */
export function findQueryData<T>({
  queryClient,
  queryKey,
  where,
}: FindQueryDataOptions<T>): T | undefined {
  for (const [, data] of queryClient.getQueriesData<unknown>({ queryKey })) {
    if (isInfiniteData(data)) {
      for (const page of data.pages) {
        const found = page.items.find((item) => matchesItem(where, item));

        if (found) {
          return found as T;
        }
      }
    } else if (isList(data)) {
      const found = data.items.find((item) => matchesItem(where, item));

      if (found) {
        return found as T;
      }
    } else if (data && matchesItem(where, data)) {
      return data as T;
    }
  }

  return undefined;
}
