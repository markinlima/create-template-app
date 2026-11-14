import Elysia from "elysia";

import { modelPlugin } from "@/http/plugins/model-plugin";
import { auth } from "@/lib/auth";
import { noResponse } from "@/utils/no-response";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const signOutRoute = new Elysia().use(modelPlugin()).post(
	"/sign-out",
	async ({ request, status, set }) => {
		const { headers } = await auth.api.signOut({ headers: request.headers, returnHeaders: true });

		// Expires the session cookie in the browser; the session row is removed by Better Auth.
		set.headers["set-cookie"] = headers.getSetCookie();

		return status(204, null);
	},
	{
		response: {
			...defaultResponses,
			204: noResponse(),
		},
		detail: {
			"x-data-shape": undefined,
			"x-cache-entity": "User",
			"x-pagination-type": undefined,
			operationId: "sign-out",
			summary: "Sign out",
			description: "Ends the current session, whether or not the cookie is still valid.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
