import Elysia from "elysia";

import { env } from "@/env";
import { ForbiddenError } from "@/errors/http/forbidden-error";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * The session cookie is sent on cross-site requests in production (`SameSite=None`), and simple requests (a JSON body sent as `text/plain`)
 * skip the CORS preflight. So CORS alone doesn't stop a third-party page from making a signed-in browser change data: browsers send `Origin`
 * on cross-origin state-changing requests, and those are rejected unless the origin is one of ours. Clients without a browser send no
 * `Origin` and pass through.
 */
export function csrfPlugin() {
	const trustedOrigins = new Set([...env.CORS_ORIGIN, env.BETTER_AUTH_URL].map((url) => new URL(url).origin));

	return new Elysia({ name: "csrf-plugin" }).onRequest(({ request }) => {
		if (SAFE_METHODS.has(request.method)) {
			return;
		}

		const origin = request.headers.get("origin");

		if (origin === null) {
			if (request.headers.get("sec-fetch-site") === "cross-site") {
				throw new ForbiddenError("Origem da requisição não permitida.");
			}

			return;
		}

		if (!trustedOrigins.has(origin)) {
			throw new ForbiddenError("Origem da requisição não permitida.");
		}
	});
}
