import type { Breadcrumb, ErrorEvent } from "@sentry/react";

import { redactUserPaths } from "@/lib/sentry/redact-user-paths";

function redactData(data: Record<string, unknown> | undefined) {
	for (const [key, value] of Object.entries(data ?? {})) {
		if (typeof value === "string") {
			(data as Record<string, unknown>)[key] = redactUserPaths(value);
		}
	}
}

/** Takes the usernames out of the addresses an error report carries: the page, the request, the transaction and the breadcrumbs. */
export function redactEventUrls(event: ErrorEvent) {
	if (event.request?.url) {
		event.request.url = redactUserPaths(event.request.url);
	}

	if (event.transaction) {
		event.transaction = redactUserPaths(event.transaction);
	}

	for (const breadcrumb of event.breadcrumbs ?? []) {
		redactBreadcrumb(breadcrumb);
	}

	return event;
}

/** Takes the usernames out of the addresses of one breadcrumb (navigation, requests, clicks). */
export function redactBreadcrumb(breadcrumb: Breadcrumb) {
	redactData(breadcrumb.data);

	if (breadcrumb.message) {
		breadcrumb.message = redactUserPaths(breadcrumb.message);
	}

	return breadcrumb;
}
