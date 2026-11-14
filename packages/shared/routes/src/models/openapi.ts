import z from "zod";

/** The tags of the OpenAPI document. A route's `detail.tags` and `detail["x-cache-entity"]` take one of these. FIXME: Placeholder list (the example domains of the cache helpers and the auth/health/user routes), replace it with the domains of the project. */
export const openApiTag = z.enum([
  "Auth",
  "Collection",
  "Comment",
  "Health",
  "Post",
  "User",
]);

export type OpenApiTag = z.infer<typeof openApiTag>;

/** What the response of a route holds: a DTO (a model of `models/`) or a shape only the route has. Used by the frontend to pick its cache. */
export const dataShape = z.enum(["dto", "custom"]);

export type DataShape = z.infer<typeof dataShape>;

/** How a list is paginated: `none` for a single item or an action, `full` for a list with no pages, `cursor` or `page` for the paged ones. */
export const paginationType = z.enum(["cursor", "page", "full", "none"]);

export type PaginationType = z.infer<typeof paginationType>;
