import { describe, expect, it } from "bun:test";

import { parseList } from "./parse-list";

describe("parseList", () => {
  it("should split on commas and whitespace", () => {
    expect(parseList(" unit, integration\ne2e ,")).toEqual([
      "unit",
      "integration",
      "e2e",
    ]);
  });
});
