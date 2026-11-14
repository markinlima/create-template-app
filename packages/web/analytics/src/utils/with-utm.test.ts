import { describe, expect, it } from "bun:test";

import { withUtm } from "./with-utm";

describe("withUtm", () => {
  it("adds the utm params to a URL without a query", () => {
    const url = withUtm("https://example.test/share/post/1", {
      source: "whatsapp",
      medium: "user-share",
      campaign: "share-post",
    });

    expect(url).toBe(
      "https://example.test/share/post/1?utm_source=whatsapp&utm_medium=user-share&utm_campaign=share-post",
    );
  });

  it("keeps the existing query params", () => {
    const url = withUtm("https://example.test/share/post/1?ref=home", {
      source: "x",
      medium: "user-share",
      campaign: "share-post",
    });

    const parsed = new URL(url);

    expect(parsed.searchParams.get("ref")).toBe("home");
    expect(parsed.searchParams.get("utm_source")).toBe("x");
  });

  it("encodes the values and sets utm_content when given", () => {
    const url = withUtm("https://example.test/share/post/1", {
      source: "copy link",
      medium: "user-share",
      campaign: "share-post",
      content: "a&b",
    });

    const parsed = new URL(url);

    expect(parsed.searchParams.get("utm_source")).toBe("copy link");
    expect(parsed.searchParams.get("utm_content")).toBe("a&b");
    expect(url).toContain("utm_source=copy+link");
  });
});
