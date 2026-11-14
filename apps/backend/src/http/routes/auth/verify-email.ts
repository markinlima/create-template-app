import Elysia from "elysia";

import { verifyEmailBody } from "@shared/routes/api/auth";

import { modelPlugin } from "@/http/plugins/model-plugin";
import { auth } from "@/lib/auth";
import { noResponse } from "@/utils/no-response";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const verifyEmailRoute = new Elysia().use(modelPlugin()).post(
	"/verify-email",
	async ({ body, status }) => {
		await auth.api.verifyEmailOTP({
			body: { email: body.email, otp: body.otp },
		});

		return status(204, null);
	},
	{
		parse: "json",
		body: verifyEmailBody,
		response: {
			...defaultResponses,
			204: noResponse(),
			400: "ErrorModel",
			401: "ErrorModel",
		},
		detail: {
			"x-data-shape": undefined,
			"x-cache-entity": "User",
			"x-pagination-type": undefined,
			operationId: "verify-email",
			summary: "Verify email",
			description: "Marks the e-mail as verified with the code sent by `request-email-verification`.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
