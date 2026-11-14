import Elysia from "elysia";

import { getMeResponse } from "@shared/routes/api/users";

import { authPlugin } from "@/http/plugins/auth-plugin";
import { modelPlugin } from "@/http/plugins/model-plugin";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

/** The example of a protected route: `authPlugin()` answers 401 without a verified session, and the handler reads `session`. */
export const getMeRoute = new Elysia()
	.use(modelPlugin())
	.use(authPlugin())
	.get("/me", ({ session, status }) => status(200, { user: session.user }), {
		response: {
			...defaultResponses,
			200: getMeResponse,
			401: "ErrorModel",
		},
		detail: {
			"x-data-shape": "dto",
			"x-cache-entity": "User",
			"x-pagination-type": "none",
			operationId: "get-me",
			summary: "Get me",
			description: "The signed-in user. Needs a verified e-mail.",
			tags: ["User"],
			responses: {
				...defaultResponseDetails,
			},
		},
	});
