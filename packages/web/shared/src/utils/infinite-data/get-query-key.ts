import type { OpenApiTag } from "@shared/routes/models";
import type { DataShape, PaginationType } from "@shared/routes/schemas";

/**
 * The key that matches the queries of one pagination type: `queryKey[1]` narrows it down (e.g. to one operation).
 *
 * @param queryKey - The entity, and optionally what narrows it down.
 * @param paginationType - The pagination type the queries must have.
 */
export function getQueryKey(
  queryKey: [OpenApiTag, object?],
  paginationType: PaginationType,
) {
  return [
    queryKey[0],
    {
      paginationType,
      dataShape: "dto" satisfies DataShape,
      ...queryKey[1],
    },
  ];
}
