import { describe, expect, it } from "bun:test";

import { TEST_SITE } from "../test/site";
import { buildPageMeta } from "./build-page-meta";

describe("buildPageMeta", () => {
  it("puts the brand after the title, in the title of the page and of the previews", () => {
    const meta = buildPageMeta({
      page: { title: "Sobre nós" },
      site: TEST_SITE,
    });

    expect(meta[0]).toEqual({ title: "Sobre nós | Example App" });
    expect(meta).toContainEqual({
      property: "og:title",
      content: "Sobre nós | Example App",
    });
    expect(meta).toContainEqual({
      name: "twitter:title",
      content: "Sobre nós | Example App",
    });
  });

  it("only says the description when the page has one, to Open Graph and Twitter too", () => {
    expect(
      buildPageMeta({ page: { title: "A" }, site: TEST_SITE }).some(
        (tag) => "name" in tag && tag.name === "description",
      ),
    ).toBe(false);

    const meta = buildPageMeta({
      page: { title: "A", description: "Texto" },
      site: TEST_SITE,
    });
    expect(meta).toContainEqual({ name: "description", content: "Texto" });
    expect(meta).toContainEqual({
      property: "og:description",
      content: "Texto",
    });
    expect(meta).toContainEqual({
      name: "twitter:description",
      content: "Texto",
    });
  });

  it("asks not to be indexed only when told to", () => {
    expect(
      buildPageMeta({ page: { title: "A" }, site: TEST_SITE }),
    ).not.toContainEqual({ name: "robots", content: "noindex, nofollow" });
    expect(
      buildPageMeta({ page: { title: "A", noIndex: true }, site: TEST_SITE }),
    ).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
  });
});
