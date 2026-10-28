import { describe, expect, it } from "vitest";

import { getThemeStyle } from "@/core/themes/get-theme-style";

describe("getThemeStyle", () => {
	it("turns each color token into a CSS variable with the same name", () => {
		expect(getThemeStyle({ background: "red", "muted-foreground": "blue" })).toEqual({
			"--background": "red",
			"--muted-foreground": "blue",
		});
	});
});
