import Elysia from "elysia";

import { getSessionResponse } from "@shared/routes/api/auth";

import { authPlugin } from "@/http/plugins/auth-plugin";
import { modelPlugin } from "@/http/plugins/model-plugin";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const getSessionRoute = new Elysia()
	.use(modelPlugin())
	.use(authPlugin({ required: false, requireEmailVerification: false }))
	.get("/session", ({ session, status }) => status(200, { session }), {
		response: {
			...defaultResponses,
			200: getSessionResponse,
		},
		detail: {
			"x-data-shape": "dto",
			"x-cache-entity": "User",
			"x-pagination-type": "none",
			operationId: "get-session",
			summary: "Get session",
			description: "The signed-in user and session, or `null` when there is no valid session. An unverified e-mail still gets its session.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	});
