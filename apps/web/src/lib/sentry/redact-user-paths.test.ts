import { describe, expect, it } from "bun:test";

import { redactUserPaths } from "@/lib/sentry/redact-user-paths";

describe("redactUserPaths", () => {
	it("hides the username of a profile, of a share page and of the collections of a user", () => {
		expect(redactUserPaths("https://example.test/app/profile/ana")).toBe("https://example.test/app/profile/:username");
		expect(redactUserPaths("/share/profile/ana?utm_source=x")).toBe("/share/profile/:username?utm_source=x");
		expect(redactUserPaths("/app/collections/ana#top")).toBe("/app/collections/:username#top");
		expect(redactUserPaths("/app/profile/ana/badges")).toBe("/app/profile/:username/badges");
	});

	it("leaves the other addresses as they are", () => {
		expect(redactUserPaths("/app/feed/trending")).toBe("/app/feed/trending");
		expect(redactUserPaths("/app/collection/0b1c")).toBe("/app/collection/0b1c");
		expect(redactUserPaths("/app/profile")).toBe("/app/profile");
	});
});
