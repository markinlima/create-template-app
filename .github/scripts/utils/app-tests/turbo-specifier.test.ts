import { describe, expect, it } from "bun:test";

import { turboSpecifier } from "./turbo-specifier";

describe("turboSpecifier", () => {
  it("should ask for the range of the root package.json", () => {
    expect(turboSpecifier({ devDependencies: { turbo: "^2.11.7" } })).toBe(
      "turbo@^2.11.7",
    );
    expect(turboSpecifier({ dependencies: { turbo: "2.0.0" } })).toBe(
      "turbo@2.0.0",
    );
  });

  it("should take the latest when the root package.json does not say", () => {
    expect(turboSpecifier({})).toBe("turbo");
  });
});
