import { describe, expect, it } from "bun:test";

import { getFrameAncestor } from "./get-frame-ancestor";

describe("getFrameAncestor", () => {
	it("keeps only the origin, so the path is dropped", () => {
		expect(getFrameAncestor("https://analytics.example.com/some/path?x=1")).toBe("https://analytics.example.com");
		expect(getFrameAncestor("http://localhost:3000/")).toBe("http://localhost:3000");
	});

	it("is empty when Umami is not configured", () => {
		expect(getFrameAncestor(undefined)).toBe("");
		expect(getFrameAncestor("")).toBe("");
	});

	it("is empty for something that is not an http(s) URL", () => {
		expect(getFrameAncestor("not a url")).toBe("");
		expect(getFrameAncestor("javascript:alert(1)")).toBe("");
		expect(getFrameAncestor("ftp://files.example.com")).toBe("");
	});
});
