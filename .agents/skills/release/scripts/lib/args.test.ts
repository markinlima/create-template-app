import { describe, expect, it } from "bun:test";

import { parseArgs } from "./args";

describe("parseArgs", () => {
  it("reads values and flags", () => {
    const { flags, values } = parseArgs(
      ["--title", "chore: x", "--draft", "--base", "dev"],
      ["title", "base"],
    );

    expect(values.get("title")).toBe("chore: x");
    expect(values.get("base")).toBe("dev");
    expect(flags.has("draft")).toBe(true);
    expect(flags.has("dry-run")).toBe(false);
  });

  it("does not take the next flag as the value of a name given without one", () => {
    expect(parseArgs(["--title"], ["title"]).values.get("title")).toBe("");
  });
});
