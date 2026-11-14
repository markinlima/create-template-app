import { describe, expect, it } from "bun:test";

import { formatEnvVariables } from "../../src/utils";

describe("formatEnvVariables", () => {
  it("should turn empty strings into undefined", () => {
    expect(formatEnvVariables({ A: "" }).A).toBeUndefined();
  });

  it("should turn whitespace-only strings into undefined", () => {
    expect(formatEnvVariables({ A: "   " }).A).toBeUndefined();
  });

  it("should trim strings", () => {
    expect(formatEnvVariables({ A: "  value  " }).A).toBe("value");
  });

  it.each([
    ["true", true],
    ["TRUE", true],
    ["false", false],
    ["False", false],
  ])("should convert '%s' to a boolean", (value, expected) => {
    expect(formatEnvVariables({ A: value }).A).toBe(expected);
  });

  it("should keep other strings untouched", () => {
    expect(formatEnvVariables({ A: "yes", B: "1" })).toEqual({
      A: "yes",
      B: "1",
    });
  });

  it("should keep non-string values untouched", () => {
    expect(formatEnvVariables({ A: 1, B: null })).toEqual({ A: 1, B: null });
  });

  it("should throw when the input is not an object", () => {
    // @ts-expect-error - testing the runtime guard
    expect(() => formatEnvVariables("nope")).toThrow("Input must be a object");
  });
});
