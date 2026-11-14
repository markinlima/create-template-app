import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { produce } from "immer";

import type { OpenApiTag } from "@shared/routes/models";
import type { CursorPaginationMeta } from "@shared/routes/utils";

import { getQueryKey } from "./get-query-key";
import { matchesItem } from "./matches-item";

/** Options of {@link deleteItemFromPages}. */
export interface DeleteItemFromPages<T> {
  /** The query client that holds the caches. */
  queryClient: QueryClient;
  /** The entity, and optionally what narrows it down. */
  queryKey: [OpenApiTag, object?];
  /**
   * Match only the key given, not the keys that start with it.
   * @defaultValue false
   */
  exact?: boolean;
  /**
   * Stop at the first item that matches.
   * @defaultValue true
   */
  stopAfterFirstMatch?: boolean;
  /** Tells whether an item is the one to remove. */
  where: (data: Readonly<T>) => boolean;
}

/**
 * Removes the items that match `where` from every cached list under the key (feeds, lists) and drops the cached single items that match.
 *
 * @param options - See {@link DeleteItemFromPages}.
 * @example
 * deleteItemFromPages<Post>({ queryClient, queryKey: ["Post"], where: (post) => post.id === id });
 */
export function deleteItemFromPages<T>({
  queryClient,
  queryKey,
  exact = false,
  stopAfterFirstMatch = true,
  where,
}: DeleteItemFromPages<T>) {
  queryClient.setQueriesData<
    InfiniteData<{ items: T[]; meta: CursorPaginationMeta<string> }>
  >({ queryKey: getQueryKey(queryKey, "cursor"), exact }, (oldData) => {
    // NOTE: a key that is not narrowed down also matches caches that are not infinite data
    if (!oldData || !("pages" in oldData)) {
      return oldData;
    }

    return produce(oldData, (draft) => {
      let hasRemoved = false;

      // NOTE: only the item leaves its page; the page and its cursor stay, the next ones are fetched from it
      for (const page of draft.pages) {
        page.items = page.items.filter((item) => {
          if (
            !matchesItem(where, item) ||
            (stopAfterFirstMatch && hasRemoved)
          ) {
            return true;
          }

          hasRemoved = true;
          return false;
        });
      }
    });
  });

  queryClient.setQueriesData<{ items: T[] }>(
    { queryKey: getQueryKey(queryKey, "full"), exact },
    (oldData) => {
      if (!oldData || !("items" in oldData)) {
        return oldData;
      }

      return produce(oldData, (draft) => {
        let hasRemoved = false;

        draft.items = draft.items.filter((item) => {
          if (
            !matchesItem(where, item) ||
            (stopAfterFirstMatch && hasRemoved)
          ) {
            return true;
          }

          hasRemoved = true;
          return false;
        });
      });
    },
  );

  const queryData = queryClient.getQueriesData<T>({
    queryKey: getQueryKey(queryKey, "none"),
    exact,
  });

  for (const [matchedKey, data] of queryData) {
    if (!data) {
      continue;
    }

    if (!matchesItem(where, data)) {
      continue;
    }

    queryClient.removeQueries({
      queryKey: matchedKey,
    });

    if (stopAfterFirstMatch) {
      break;
    }
  }
}
