import { describe, expect, it } from "bun:test";

import { getPathname } from "./get-pathname";

describe("getPathname", () => {
  it("reads the path of an absolute URL", () => {
    expect(getPathname("http://localhost:5173/assets/index.js")).toBe(
      "/assets/index.js",
    );
    expect(getPathname("https://example.com/about-us")).toBe("/about-us");
  });

  it("drops the query and the hash", () => {
    expect(getPathname("http://x.test/a/b?x=1&y=2")).toBe("/a/b");
    expect(getPathname("http://x.test/a#top")).toBe("/a");
  });

  it("drops a trailing slash, except for the root", () => {
    expect(getPathname("http://x.test/about-us/")).toBe("/about-us");
    expect(getPathname("http://x.test/")).toBe("/");
    expect(getPathname("http://x.test")).toBe("/");
    expect(getPathname("http://x.test/?a=1")).toBe("/");
  });

  it("reads a URL that has a query and no path", () => {
    expect(getPathname("http://x.test?a=1")).toBe("/");
  });

  it("reads a path that is already relative", () => {
    expect(getPathname("/about-us/?a=1")).toBe("/about-us");
  });
});
