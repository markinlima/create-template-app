import { describe, expect, it } from "bun:test";

import { buildSitemap } from "./build-sitemap";

describe("buildSitemap", () => {
  it("lists the home page and each address under the site", () => {
    const xml = buildSitemap({
      siteUrl: "https://site.test",
      addresses: ["/about-us", "/policies/terms-of-use"],
    });

    expect(xml).toContain("<loc>https://site.test/</loc>");
    expect(xml).toContain("<loc>https://site.test/about-us</loc>");
    expect(xml).toContain("<loc>https://site.test/policies/terms-of-use</loc>");
  });

  it("ignores a trailing slash on the site and does not repeat the home page", () => {
    const xml = buildSitemap({
      siteUrl: "https://site.test/",
      addresses: ["/"],
    });

    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain("<loc>https://site.test/</loc>");
  });

  it("escapes the characters XML reserves", () => {
    const xml = buildSitemap({
      siteUrl: "https://site.test",
      addresses: ["/a&b"],
    });

    expect(xml).toContain("<loc>https://site.test/a&amp;b</loc>");
  });
});
