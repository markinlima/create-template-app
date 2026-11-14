import Elysia from "elysia";

import { requestEmailVerificationBody } from "@shared/routes/api/auth";

import { modelPlugin } from "@/http/plugins/model-plugin";
import { auth } from "@/lib/auth";
import { noResponse } from "@/utils/no-response";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const requestEmailVerificationRoute = new Elysia().use(modelPlugin()).post(
	"/request-email-verification",
	async ({ body, status }) => {
		await auth.api.sendVerificationOTP({
			body: { email: body.email, type: "email-verification" },
		});

		return status(204, null);
	},
	{
		parse: "json",
		body: requestEmailVerificationBody,
		response: {
			...defaultResponses,
			204: noResponse(),
			400: "ErrorModel",
		},
		detail: {
			"x-data-shape": undefined,
			"x-cache-entity": "User",
			"x-pagination-type": undefined,
			operationId: "request-email-verification",
			summary: "Request email verification",
			description: "Sends a six digit code to the e-mail, to verify it with `verify-email`.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
