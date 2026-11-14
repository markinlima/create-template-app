import { describe, expect, it } from "bun:test";

import { flatUseQueryData } from "./flat-use-query-data";

describe("flatUseQueryData", () => {
  it("joins the items of every page in order", () => {
    const data = {
      pages: [{ items: [1, 2] }, { items: [3] }, { items: [] }],
      pageParams: [],
    };

    expect(flatUseQueryData(data)).toEqual([1, 2, 3]);
  });
});
