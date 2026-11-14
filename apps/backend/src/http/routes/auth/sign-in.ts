import { and, eq, or } from "drizzle-orm";
import Elysia from "elysia";

import { signInBody, signInResponse } from "@shared/routes/api/auth";
import { db } from "@backend/db";
import { sessions, users } from "@backend/db/schema";

import { UnauthorizedError } from "@/errors/http/unauthorized-error";
import { modelPlugin } from "@/http/plugins/model-plugin";
import { auth, spendPasswordCheckTime } from "@/lib/auth";
import { toSessionModel, toUserModel } from "@/mappers/user";
import { defaultResponseDetails, defaultResponses } from "@/utils/responses";

export const signInRoute = new Elysia().use(modelPlugin()).post(
	"/sign-in",
	async ({ body, status, set }) => {
		const [user] = await db
			.select({ email: users.email })
			.from(users)
			.where(or(eq(users.email, body.emailOrUsername), eq(users.username, body.emailOrUsername)));

		if (!user) {
			// Same status and message, and the same time, as a wrong password for a real account: the answer doesn't reveal who exists.
			await spendPasswordCheckTime(body.password);

			throw new UnauthorizedError("E-mail, nome de usuário ou senha inválidos.");
		}

		const { headers, response } = await auth.api.signInEmail({
			body: { email: user.email, password: body.password },
			returnHeaders: true,
		});

		set.headers["set-cookie"] = headers.getSetCookie();

		const [session] = await db
			.select()
			.from(sessions)
			.where(and(eq(sessions.token, response.token)));

		if (!session) {
			throw new UnauthorizedError("Não foi possível criar a sessão.");
		}

		return status(200, {
			user: toUserModel(response.user),
			session: toSessionModel(session),
		});
	},
	{
		parse: "json",
		body: signInBody,
		response: {
			...defaultResponses,
			200: signInResponse,
			401: "ErrorModel",
		},
		detail: {
			"x-data-shape": "dto",
			"x-cache-entity": "User",
			"x-pagination-type": "none",
			operationId: "sign-in",
			summary: "Sign in",
			description:
				"Signs in with an e-mail or a username and a password, and sets the session cookie. The e-mail doesn't have to be verified to sign in.",
			tags: ["Auth"],
			responses: {
				...defaultResponseDetails,
			},
		},
	},
);
