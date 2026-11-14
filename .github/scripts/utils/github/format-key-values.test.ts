import { describe, expect, it } from "bun:test";

import { formatKeyValues } from "./format-key-values";

describe("formatKeyValues", () => {
  it("should write one key=value line per value", () => {
    expect(formatKeyValues({ app: "web", count: "2" })).toBe(
      "app=web\ncount=2\n",
    );
  });

  it("should wrap a multi-line value in a heredoc", () => {
    const output = formatKeyValues({ tags: "a\nb" });
    const delimiter = output.split("\n")[0]?.replace("tags<<", "");

    expect(output).toBe(`tags<<${delimiter}\na\nb\n${delimiter}\n`);
  });
});
