import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { type Producer, produce } from "immer";

import type { OpenApiTag } from "@shared/routes/models";
import type { DataShape, PaginationType } from "@shared/routes/schemas";
import type { CursorPaginationMeta } from "@shared/routes/utils";

import { hasListShape } from "./has-list-shape";
import { matchesItem } from "./matches-item";

export type UpdateQueryDataProps<T> = {
  /** The query client that holds the caches. */
  queryClient: QueryClient;
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
  /** Tells whether an item is the one to change. */
  where: (data: Readonly<T>) => boolean;
  /** Changes the item (an Immer producer). */
  set: Producer<T>;
} & (
  | {
      queryKey: Readonly<[OpenApiTag, ...unknown[]]>;
      entity?: never;
    }
  | {
      queryKey?: never;
      entity: OpenApiTag;
    }
);

/**
 * Changes, in place, the items that match `where` in every cached feed, list and single item under a key (or the cache entity).
 *
 * @param props - See {@link UpdateQueryDataProps}.
 * @returns `affectedCount`: how many items were changed.
 * @example
 * updateQueryData<Post>({ queryClient, entity: "Post", where: (p) => p.id === id, set: (p) => { p.liked = true; } });
 */
export function updateQueryData<T>({
  queryClient,
  exact = false,
  stopAfterFirstMatch = true,
  where,
  set,
  ...rest
}: UpdateQueryDataProps<T>) {
  let affectedCount = 0;

  queryClient.setQueriesData<
    InfiniteData<{ items: T[]; meta: CursorPaginationMeta<unknown> }>
  >(
    {
      queryKey: rest.queryKey || [
        rest.entity,
        {
          paginationType: "cursor" satisfies PaginationType,
          dataShape: "dto" satisfies DataShape,
        },
      ],
      exact,
    },
    (oldData) => {
      if (!oldData || !("pages" in oldData)) {
        return;
      }

      return produce(oldData, (draft) => {
        try {
          for (const page of draft.pages) {
            for (const item of page.items) {
              if (!matchesItem(where, item)) {
                continue;
              }

              set(item);
              affectedCount++;

              if (stopAfterFirstMatch) {
                break;
              }
            }
          }
        } catch (error) {
          console.error("Error updating query data:", error);
          return;
        }
      });
    },
  );

  queryClient.setQueriesData<{ items: T[] }>(
    {
      queryKey: rest.queryKey || [
        rest.entity,
        {
          paginationType: "full" satisfies PaginationType,
          dataShape: "dto" satisfies DataShape,
        },
      ],
      exact,
    },
    (oldData) => {
      if (!oldData || !("items" in oldData)) {
        return;
      }

      return produce(oldData, (draft) => {
        for (const item of draft.items) {
          if (!matchesItem(where, item)) {
            continue;
          }

          set(item);
          affectedCount++;

          if (stopAfterFirstMatch) {
            break;
          }
        }
      });
    },
  );

  queryClient.setQueriesData<T>(
    {
      queryKey: rest.queryKey || [
        rest.entity,
        {
          paginationType: "none" satisfies PaginationType,
          dataShape: "dto" satisfies DataShape,
        },
      ],
      exact,
    },
    (oldData) => {
      // NOTE: the key matches any shape; lists and infinite data are handled above and `where` expects one item
      if (!oldData || hasListShape(oldData)) {
        return;
      }

      if (!matchesItem(where, oldData)) {
        return oldData;
      }

      affectedCount++;
      return produce(oldData, set);
    },
  );

  return { affectedCount };
}

/** Alias of {@link updateQueryData}. */
export const updateQueryCache = updateQueryData;
