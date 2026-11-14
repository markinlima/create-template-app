import openapi from "@elysiajs/openapi";
import z from "zod";

import { env } from "@/env";

/**
 * The OpenAPI document, served at `/docs` (and the JSON at `/docs/json`) outside production. The schemas are Zod: they are converted with
 * `z.toJSONSchema` (input side, OpenAPI 3.0 dialect), so the document describes what a client sends.
 */
export function openapiPlugin() {
	return openapi({
		path: "/docs",
		specPath: "/docs/json",
		documentation: {
			info: {
				title: "API", // FIXME: Placeholder. The name of the project.
				version: "1.0.0",
			},
		},
		enabled: env.NODE_ENV !== "production",
		mapJsonSchema: {
			zod: (schema: z.ZodType) =>
				z.toJSONSchema(schema, {
					target: "openapi-3.0",
					io: "input",
					override: (ctx) => {
						if (ctx.jsonSchema.$ref) {
							for (const key in ctx.jsonSchema) {
								if (key === "$ref" || key === "deprecated") {
									continue;
								}

								delete ctx.jsonSchema[key];
							}
						}

						ctx.jsonSchema.additionalProperties = false;
					},
				}),
		},
	});
}
