import { describe, expect, it, mock } from "bun:test";

import { removeSeoHeadTags } from "./remove-seo-head-tags";

describe("removeSeoHeadTags", () => {
  it("removes every tag the build wrote, and asks only for those", () => {
    const first = { remove: mock() };
    const second = { remove: mock() };
    const querySelectorAll = mock(() => [first, second]);

    removeSeoHeadTags({ querySelectorAll } as unknown as ParentNode);

    expect(querySelectorAll).toHaveBeenCalledWith("[data-seo-tag]");
    expect(first.remove).toHaveBeenCalledOnce();
    expect(second.remove).toHaveBeenCalledOnce();
  });
});
