import { describe, expect, it } from "bun:test";

import { mergeMeta } from "./merge-meta";

describe("mergeMeta", () => {
  it("keeps the later tag when two have the same key, and the order of the first", () => {
    const merged = mergeMeta(
      [{ title: "Site" }, { name: "description", content: "do site" }],
      [{ name: "description", content: "da página" }],
    );

    expect(merged).toEqual([
      { title: "Site" },
      { name: "description", content: "da página" },
    ]);
  });
});
