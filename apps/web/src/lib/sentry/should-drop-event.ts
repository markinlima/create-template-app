import type { ErrorEvent, EventHint } from "@sentry/react";
import { isAxiosError } from "axios";

/** Errors that say nothing about a bug: a message is matched against the text of the exception. */
const NOISE_MESSAGES = [
	// ? View transitions the browser aborts when the tab goes to the background.
	"Transition was aborted because of invalid state",
	// ? Only the dev server serves `.vite/deps`: it re-optimizes them while the page is open and the old ones stop loading.
	"Failed to fetch dynamically imported module: http://localhost",
] as const;

export interface ShouldDropEventOptions {
	event: ErrorEvent;
	hint: EventHint;
}

/**
 * Whether an error report is noise. The answers 4xx of the API are rules of the product (limit, permission, conflict) that the
 * screens already handle and show to the user; the 5xx and the requests with no answer stay.
 */
export function shouldDropEvent({ event, hint }: ShouldDropEventOptions) {
	const { originalException } = hint;

	if (isAxiosError(originalException)) {
		const status = originalException.response?.status;

		if (status !== undefined && status >= 400 && status < 500) {
			return true;
		}
	}

	return (event.exception?.values ?? []).some(({ value }) => !!value && NOISE_MESSAGES.some((message) => value.includes(message)));
}
