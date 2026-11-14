import { describe, expect, it } from "bun:test";

import { stringToDeterministicNumber } from "./string-to-deterministic-number";

describe("stringToDeterministicNumber", () => {
  it("gives the same number for the same string", () => {
    const options = { min: 1, max: 100 };

    expect(stringToDeterministicNumber("user-1", options)).toBe(
      stringToDeterministicNumber("user-1", options),
    );
  });

  it("stays inside the range, both ends included", () => {
    for (const input of ["a", "b", "user-1", "user-2", "", "ação"]) {
      const result = stringToDeterministicNumber(input, { min: 3, max: 5 });

      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(5);
    }
  });

  it("gives min when the range has one number", () => {
    expect(stringToDeterministicNumber("x", { min: 7, max: 7 })).toBe(7);
  });
});
