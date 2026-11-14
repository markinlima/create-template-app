import { describe, expect, it } from "bun:test";

import { settingsSchema } from "./settings-schema";

describe("settingsSchema", () => {
	it("keeps a valid boolean", () => {
		expect(settingsSchema.parse({ reducedMotion: true }).reducedMotion).toBe(true);
	});

	it("falls back to false when the value is not a boolean", () => {
		expect(settingsSchema.parse({ reducedMotion: "yes" }).reducedMotion).toBe(false);
	});

	it("falls back to false when the key is missing", () => {
		expect(settingsSchema.parse({}).reducedMotion).toBe(false);
	});
});
