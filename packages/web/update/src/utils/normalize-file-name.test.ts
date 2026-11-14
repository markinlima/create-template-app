import { describe, expect, it } from "bun:test";

import { normalizeFileName } from "./normalize-file-name";

describe("normalizeFileName", () => {
  it("removes the leading slashes", () => {
    expect(normalizeFileName("/version.json")).toBe("version.json");
    expect(normalizeFileName("//version.json")).toBe("version.json");
  });

  it("keeps a name that has no leading slash", () => {
    expect(normalizeFileName("version.json")).toBe("version.json");
  });
});
