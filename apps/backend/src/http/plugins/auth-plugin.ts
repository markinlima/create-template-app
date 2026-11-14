import type Elysia from "elysia";

import type { SessionModel, UserModel } from "@shared/routes/models";

import { UnauthorizedError } from "@/errors/http/unauthorized-error";
import { auth } from "@/lib/auth";
import { toSessionModel, toUserModel } from "@/mappers/user";

export interface AuthPluginOptions<Required> {
	/** When true (the default) a request without a session gets 401. */
	required?: Required;
	/** When true (the default) a session whose e-mail isn't verified gets 401 with the code `auth.email_not_verified`. */
	requireEmailVerification?: boolean;
}

export type AuthPluginSession = {
	user: UserModel;
	session: SessionModel;
};

export type AuthPluginResult<Required> = {
	session: Required extends true ? AuthPluginSession : AuthPluginSession | null;
};

/**
 * Reads the session cookie through Better Auth and puts `session` (the user and the session row, as the public models) in the handler.
 * Add it to a route that needs a signed-in user; `required: false` lets a route answer both signed-in and anonymous requests.
 */
export function authPlugin<Required extends boolean = true>({
	required = true as Required,
	requireEmailVerification = true,
}: AuthPluginOptions<Required> = {}) {
	return (app: Elysia) =>
		app.derive(async ({ request }) => {
			const result = await auth.api.getSession({ headers: request.headers });

			if (!result?.session) {
				if (required) {
					throw new UnauthorizedError(
						request.headers.has("cookie")
							? "Sessão inválida, faça login novamente."
							: "Você precisa fazer login para acessar este recurso.",
					);
				}

				return { session: null } satisfies AuthPluginResult<false> as AuthPluginResult<Required>;
			}

			if (requireEmailVerification && !result.user.emailVerified) {
				throw new UnauthorizedError("Você precisa verificar o seu e-mail para acessar este recurso.", {
					code: "auth.email_not_verified",
				});
			}

			return {
				session: {
					user: toUserModel(result.user),
					session: toSessionModel(result.session),
				},
			} satisfies AuthPluginResult<true> as AuthPluginResult<Required>;
		});
}
