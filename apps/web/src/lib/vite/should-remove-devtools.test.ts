import { describe, expect, it } from "bun:test";

import { shouldRemoveDevtools } from "@/lib/vite/should-remove-devtools";

describe("shouldRemoveDevtools", () => {
	it("keeps the devtools in a staging build made in debug mode", () => {
		expect(shouldRemoveDevtools({ VITE_DEBUG_MODE: "true", VITE_USER_NODE_ENV: "staging" })).toBe(false);
	});

	it("removes them from a production build even in debug mode", () => {
		expect(shouldRemoveDevtools({ VITE_DEBUG_MODE: "true", VITE_USER_NODE_ENV: "production" })).toBe(true);
		expect(shouldRemoveDevtools({ VITE_DEBUG_MODE: "true" })).toBe(true);
	});

	it("removes them when the debug mode is not on", () => {
		expect(shouldRemoveDevtools({ VITE_USER_NODE_ENV: "staging" })).toBe(true);
		expect(shouldRemoveDevtools({ VITE_DEBUG_MODE: "false", VITE_USER_NODE_ENV: "staging" })).toBe(true);
	});
});
