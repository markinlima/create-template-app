import * as Sentry from "@sentry/react";

import { clientEnv } from "@/lib/env/client";
import { redactBreadcrumb, redactEventUrls } from "@/lib/sentry/redact-event-urls";
import { shouldDropEvent } from "@/lib/sentry/should-drop-event";
import { warnFeatureDisabled } from "@/lib/warn-feature-disabled";
import { readTrackingPermissions } from "@/modules/privacy/utils/read-tracking-permissions";

const isProduction = clientEnv.VITE_USER_NODE_ENV === "production";

/** Error reports only run with a DSN: without one nothing is initialized and nothing is sent. */
export const isSentryEnabled = !!clientEnv.VITE_SENTRY_DSN;

if (isSentryEnabled) {
	initSentry();
} else {
	warnFeatureDisabled({ feature: "Sentry (error reports)", envs: ["VITE_SENTRY_DSN"] });
}

function initSentry() {
	Sentry.init({
		dsn: clientEnv.VITE_SENTRY_DSN,
		release: clientEnv.VITE_WEB_VERSION,
		environment: clientEnv.VITE_USER_NODE_ENV,
		// ? The reports of errors are always sent, anonymous: no user info (the IP included) by itself. The id of the user is set only for who agreed to be tracked by id (the privacy module).
		dataCollection: { userInfo: false },
		tracesSampleRate: isProduction ? 0.1 : 1,
		tracePropagationTargets: [clientEnv.VITE_API_URL],
		ignoreErrors: [
			// ? Harmless browser noise that is not a bug in the app.
			"ResizeObserver loop limit exceeded",
			"ResizeObserver loop completed with undelivered notifications",
			"Non-Error promise rejection captured",
			// ? Requests aborted on purpose (navigation, unmounted queries).
			"CanceledError",
			"AbortError",
		],
		// ? Reports that are noise instead of bugs (see the function for which ones).
		beforeSend: (event, hint) => {
			if (shouldDropEvent({ event, hint })) {
				return null;
			}

			// ? Without the tracking by id the report must not say whose page was open: the usernames of the addresses are hidden.
			return readTrackingPermissions().identify ? event : redactEventUrls(event);
		},
		beforeBreadcrumb: (breadcrumb) => (readTrackingPermissions().identify ? breadcrumb : redactBreadcrumb(breadcrumb)),
		// ? Errors that come from browser extensions, not from our code.
		denyUrls: [/^chrome-extension:\/\//i, /^moz-extension:\/\//i, /^safari-extension:\/\//i],
	});
	Sentry.logger.info(`Sentry initialized in ${isProduction ? "production" : "development"} mode.`);
}

export { Sentry };
