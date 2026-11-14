import { describe, expect, it } from "bun:test";

import { renderHeadTags } from "./render-head-tags";

describe("renderHeadTags", () => {
  it("writes each tag on its own line, marked with the attribute of the crawlers", () => {
    const html = renderHeadTags({
      meta: [{ title: "A" }, { name: "description", content: "B" }],
      links: [{ rel: "canonical", href: "https://site.test/a" }],
    });

    expect(html.split("\n")).toEqual([
      "    <title data-seo-tag>A</title>",
      `    <meta data-seo-tag name="description" content="B" />`,
      `    <link data-seo-tag rel="canonical" href="https://site.test/a" />`,
    ]);
  });
});
