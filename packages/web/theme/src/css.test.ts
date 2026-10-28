import { describe, expect, it } from "vitest";

import { convertThemeToCss } from "./css";

describe("convertThemeToCss", () => {
  it("should convert colors to CSS variable declarations", () => {
    expect(
      convertThemeToCss({ background: "red", "primary-foreground": "blue" }),
    ).toBe("--background: red;--primary-foreground: blue;");
  });

  it("should return an empty string without colors", () => {
    expect(convertThemeToCss({})).toBe("");
  });
});
