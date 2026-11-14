import Elysia from "elysia";

import { signUpBody, signUpResponse } from "@shared/routes/api/auth";

import { modelPlugin } from "@/http/plugins/model-plugin";
import { auth } from "@/lib/auth";
import { toUserModel } from "@/mappers/user";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const signUpRoute = new Elysia().use(modelPlugin()).post(
	"/sign-up",
	async ({ body, status }) => {
		const { user } = await auth.api.signUpEmail({
			body: {
				name: body.name,
				email: body.email,
				password: body.password,
				username: body.username,
				displayUsername: body.username,
			},
		});

		// The account is created unverified and signed out: the client asks for the e-mail code next (`request-email-verification`).
		return status(201, { user: toUserModel(user) });
	},
	{
		parse: "json",
		body: signUpBody,
		response: {
			...defaultResponses,
			201: signUpResponse,
			400: "ErrorModel",
			422: "ErrorModel",
		},
		detail: {
			"x-data-shape": "dto",
			"x-cache-entity": "User",
			"x-pagination-type": "none",
			operationId: "sign-up",
			summary: "Sign up",
			description: "Creates an account with an unverified e-mail. It doesn't sign in: verify the e-mail, then sign in.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
