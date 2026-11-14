import { describe, expect, it } from "bun:test";

import { toBaitFileName } from "./to-bait-file-name";

describe("toBaitFileName", () => {
  it("drops the leading slash", () => {
    expect(toBaitFileName("/ads/ads.js")).toBe("ads/ads.js");
  });

  it("drops the query and the hash", () => {
    expect(toBaitFileName("/ads/ads.js?v=1#x")).toBe("ads/ads.js");
  });
});
