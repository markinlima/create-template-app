import { describe, expect, it } from "bun:test";

import type { ErrorEvent, EventHint } from "@sentry/react";
import { AxiosError } from "axios";

import { shouldDropEvent } from "@/lib/sentry/should-drop-event";

function eventOf(value: string): ErrorEvent {
	return { type: undefined, exception: { values: [{ type: "Error", value }] } };
}

function axiosHint(status: number): EventHint {
	const error = new AxiosError("Request failed", "ERR_BAD_REQUEST");
	error.response = { status, data: {}, statusText: "", headers: {}, config: { headers: {} } as never };
	return { originalException: error };
}

describe("shouldDropEvent", () => {
	it("drops a view transition aborted because the tab was hidden", () => {
		const event = eventOf("InvalidStateError: Transition was aborted because of invalid state. Document hidden");

		expect(shouldDropEvent({ event, hint: {} })).toBe(true);
	});

	it("drops the answers 4xx of the API, which the app already shows to the user", () => {
		for (const status of [402, 403, 404, 409]) {
			expect(shouldDropEvent({ event: eventOf("Request failed"), hint: axiosHint(status) })).toBe(true);
		}
	});

	it("keeps the server errors and the requests that got no answer", () => {
		expect(shouldDropEvent({ event: eventOf("Request failed"), hint: axiosHint(500) })).toBe(false);
		expect(shouldDropEvent({ event: eventOf("Network Error"), hint: { originalException: new AxiosError("Network Error") } })).toBe(false);
	});

	it("drops a dev server dependency that failed to load, since the dev server re-optimizes them while the page is open", () => {
		const event = eventOf("TypeError: Failed to fetch dynamically imported module: http://localhost:5173/node_modules/.vite/deps/a.js?v=1");

		expect(shouldDropEvent({ event, hint: {} })).toBe(true);
	});

	it("keeps a built chunk that failed to load, which is a real failure of a deploy", () => {
		const event = eventOf("TypeError: Failed to fetch dynamically imported module: https://app.test/assets/index-abc.js");

		expect(shouldDropEvent({ event, hint: {} })).toBe(false);
	});

	it("keeps any other error", () => {
		expect(shouldDropEvent({ event: eventOf("TypeError: x is undefined"), hint: {} })).toBe(false);
	});
});
