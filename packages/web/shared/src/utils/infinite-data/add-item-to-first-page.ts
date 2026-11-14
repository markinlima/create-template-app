import type { QueryClient } from "@tanstack/react-query";
import { castDraft, produce } from "immer";

import type { OpenApiTag } from "@shared/routes/models";
import type { DataShape, PaginationType } from "@shared/routes/schemas";

import { isInfiniteList } from "./is-infinite-list";
import { isPlainList } from "./is-plain-list";

/** Options of {@link addItemToFirstPage}. */
export interface AddItemToFirstPageOptions<T> {
  /** The query client that holds the caches. */
  queryClient: QueryClient;
  /** The entity, and optionally what narrows it down (e.g. `{ operationId }`). */
  queryKey: [OpenApiTag, object?];
  /**
   * Match only the key given, not the keys that start with it.
   * @defaultValue false
   */
  exact?: boolean;
  /** The item to put at the start. */
  newItem: T;
}

/**
 * Puts a new item at the start of every cached list that matches the key. The same key (`list-user-collections` of a user) is cached
 * by more than one kind of query: the list that scrolls and the preview with a `limit` that a profile shows, so each entry is patched
 * for the shape it has, and a preview keeps the number of items it asked for.
 *
 * @param options - See {@link AddItemToFirstPageOptions}.
 * @example
 * addItemToFirstPage({ queryClient, queryKey: ["User", { operationId: "list-users" }], newItem: user });
 */
export function addItemToFirstPage<T>({
  queryClient,
  queryKey,
  exact = false,
  newItem,
}: AddItemToFirstPageOptions<T>) {
  const entries = queryClient.getQueriesData({
    queryKey: [
      queryKey[0],
      {
        paginationType: "cursor" satisfies PaginationType,
        dataShape: "dto" satisfies DataShape,
        ...queryKey[1],
      },
    ],
    exact,
  });

  for (const [entryKey, data] of entries) {
    if (isInfiniteList<T>(data)) {
      queryClient.setQueryData(
        entryKey,
        produce(data, (draft) => {
          draft.pages[0]?.items.unshift(castDraft(newItem));
        }),
      );
      continue;
    }

    if (isPlainList<T>(data)) {
      const params = entryKey[1] as { limit?: unknown } | undefined;
      const limit =
        typeof params?.limit === "number" ? params.limit : undefined;

      queryClient.setQueryData(
        entryKey,
        produce(data, (draft) => {
          draft.items.unshift(castDraft(newItem));

          if (limit !== undefined) {
            draft.items.length = Math.min(draft.items.length, limit);
          }
        }),
      );
    }
  }

  queryClient.setQueriesData<{ items: T[] }>(
    {
      queryKey: [
        ...queryKey,
        {
          paginationType: "full" satisfies PaginationType,
          dataShape: "dto" satisfies DataShape,
        },
      ],
      exact,
    },
    (oldData) => {
      if (!oldData) {
        return;
      }

      return produce(oldData, (draft) => {
        draft.items.unshift(castDraft(newItem));
      });
    },
  );
}
