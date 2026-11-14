import { describe, expect, it } from "bun:test";

import { applyReducedMotion } from "./apply-reduced-motion";

function fakeRoot() {
	return { dataset: {} as Record<string, string | undefined> } as unknown as HTMLElement;
}

describe("applyReducedMotion", () => {
	it("sets data-reduced-motion to true when the choice is on", () => {
		const root = fakeRoot();

		applyReducedMotion(root, true);

		expect(root.dataset.reducedMotion).toBe("true");
	});

	it("sets data-reduced-motion to false when the choice is off", () => {
		const root = fakeRoot();

		applyReducedMotion(root, false);

		expect(root.dataset.reducedMotion).toBe("false");
	});
});
