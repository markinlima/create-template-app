import "elysia";

import type { DataShape, OpenApiTag, PaginationType } from "@shared/routes/models";

// The `detail` of every route is typed: the tags, the operation id and the three `x-*` fields that the frontend's cache reads.
declare module "elysia" {
	export interface DocumentDecoration {
		operationId: string;
		summary: string;
		tags: [OpenApiTag, ...OpenApiTag[]];
		"x-cache-entity": OpenApiTag | undefined;
		"x-pagination-type": PaginationType | undefined;
		"x-data-shape": DataShape | undefined;
	}
}
