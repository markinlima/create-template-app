import { describe, expect, it } from "bun:test";

import { TEST_SITE } from "../test/site";
import { buildDefaultMeta } from "./build-default-meta";

describe("buildDefaultMeta", () => {
  it("writes the title and the description of the site", () => {
    const meta = buildDefaultMeta({
      siteUrl: "https://site.test",
      site: TEST_SITE,
    });

    expect(meta).toContainEqual({ title: TEST_SITE.title });
    expect(meta).toContainEqual({
      name: "description",
      content: TEST_SITE.description,
    });
    expect(meta).toContainEqual({ property: "og:locale", content: "pt_BR" });
  });

  it("gives the image as an absolute address, whatever the trailing slash of the site", () => {
    const meta = buildDefaultMeta({
      siteUrl: "https://site.test//",
      site: TEST_SITE,
    });

    expect(meta).toContainEqual({
      property: "og:url",
      content: "https://site.test",
    });
    expect(meta).toContainEqual({
      property: "og:image",
      content: "https://site.test/images/opengraph.webp",
    });
  });
});
