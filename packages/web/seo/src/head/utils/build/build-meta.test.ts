import { describe, expect, it } from "bun:test";

import { buildMeta } from "./build-meta";

describe("buildMeta", () => {
  it("writes the title to the document, Open Graph and Twitter with one option", () => {
    const { meta } = buildMeta({ title: "Página boa" });

    expect(meta).toEqual([
      { title: "Página boa" },
      { property: "og:title", content: "Página boa" },
      { name: "twitter:title", content: "Página boa" },
    ]);
  });

  it("writes the description to the page, Open Graph and Twitter with one option", () => {
    const { meta } = buildMeta({ description: "d" });

    expect(meta).toEqual([
      { name: "description", content: "d" },
      { property: "og:description", content: "d" },
      { name: "twitter:description", content: "d" },
    ]);
  });

  it("writes the address to Open Graph and Twitter, and the image with its size", () => {
    const { meta } = buildMeta({
      url: "https://site.test/x",
      image: "https://img.test/a.webp",
      imageWidth: 800,
      imageHeight: 600,
    });

    expect(meta).toContainEqual({
      property: "og:url",
      content: "https://site.test/x",
    });
    expect(meta).toContainEqual({
      name: "twitter:url",
      content: "https://site.test/x",
    });
    expect(meta).toContainEqual({
      property: "og:image",
      content: "https://img.test/a.webp",
    });
    expect(meta).toContainEqual({
      name: "twitter:image",
      content: "https://img.test/a.webp",
    });
    expect(meta).toContainEqual({ property: "og:image:width", content: "800" });
    expect(meta).toContainEqual({
      property: "og:image:height",
      content: "600",
    });
  });

  it("writes one tag for each of the other options it is given", () => {
    const { meta } = buildMeta({
      keywords: "exemplos",
      author: "Foxy",
      applicationName: "Example App",
      referrer: "origin-when-cross-origin",
      robots: "noindex, nofollow",
      themeColor: "#112233",
      siteName: "Example App",
      locale: "pt_BR",
      type: "profile",
      twitterCard: "summary",
      twitterCreator: "@foxy",
      articleAuthor: "foxy",
      articlePublishedTime: "2026-01-01T10:00:00.000Z",
      articleModifiedTime: "2026-02-01T00:00:00.000Z",
    });

    expect(meta).toEqual([
      { name: "keywords", content: "exemplos" },
      { name: "author", content: "Foxy" },
      { name: "application-name", content: "Example App" },
      { name: "referrer", content: "origin-when-cross-origin" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#112233" },
      { property: "og:site_name", content: "Example App" },
      { property: "og:type", content: "profile" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:creator", content: "@foxy" },
      { property: "article:author", content: "foxy" },
      {
        property: "article:published_time",
        content: "2026-01-01T10:00:00.000Z",
      },
      {
        property: "article:modified_time",
        content: "2026-02-01T00:00:00.000Z",
      },
    ]);
  });

  it("leaves out the tags whose value it is not given", () => {
    expect(buildMeta().meta).toEqual([]);
    expect(
      buildMeta({ image: null, imageWidth: null, articleModifiedTime: null })
        .meta,
    ).toEqual([]);
  });

  it("gives a canonical link only when it is told one", () => {
    expect(buildMeta({}).links).toEqual([]);
    expect(
      buildMeta({ canonical: "https://site.test/app/post/1" }).links,
    ).toEqual([{ rel: "canonical", href: "https://site.test/app/post/1" }]);
  });
});
