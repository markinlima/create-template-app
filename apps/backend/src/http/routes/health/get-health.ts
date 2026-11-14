import Elysia from "elysia";

import { getHealthResponse } from "@shared/routes/api/health";

import { modelPlugin } from "@/http/plugins/model-plugin";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

const startedAt = Date.now();

export const getHealthRoute = new Elysia().use(modelPlugin()).get(
	"/healthz",
	({ status }) =>
		status(200, {
			health: {
				status: "ok" as const,
				uptimeInSeconds: Math.round((Date.now() - startedAt) / 1000),
			},
		}),
	{
		response: {
			...defaultResponses,
			200: getHealthResponse,
		},
		detail: {
			"x-data-shape": "dto",
			"x-cache-entity": undefined,
			"x-pagination-type": "none",
			operationId: "get-health",
			summary: "Get health",
			description: "Answers while the server is up. Used by the container health check and by load balancers.",
			tags: ["Health"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
