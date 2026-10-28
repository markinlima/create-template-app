import { describe, expect, it } from "bun:test";

import { dedupe } from "./dedupe";

describe("dedupe", () => {
  it("removes repeated values keeping the first occurrence", () => {
    expect(dedupe([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });
});
