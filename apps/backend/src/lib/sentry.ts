import * as Sentry from "@sentry/elysia";

import { env } from "@/env";

/**
 * Error reports through the Sentry SDK. The server can be Sentry or any server that speaks its protocol (Rustrak does): only the DSN changes.
 * Without a DSN nothing is initialized and nothing is sent. Imported before the app, so the SDK is ready when the first request arrives.
 */
export const isSentryEnabled = !!env.SENTRY_DSN;

if (isSentryEnabled) {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		environment: env.NODE_ENV,
		release: env.SENTRY_RELEASE,
		// ? No personal data (IP, cookies, the user's identity) is sent by default.
		sendDefaultPii: false,
		tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1,
	});
} else {
	console.warn("[sentry] SENTRY_DSN is not set: error reports are not sent.");
}

export { Sentry };
