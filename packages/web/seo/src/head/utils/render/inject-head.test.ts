import { describe, expect, it } from "bun:test";

import { injectHead } from "./inject-head";

// NOTE: the shell of the web app already has the tags of the site (written at build time, marked with data-seo-tag).
const shell = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title data-seo-tag>Site</title>
    <meta data-seo-tag name="description" content="do site" />
    <meta data-seo-tag property="og:title" content="Site" />
    <meta data-seo-tag property="og:site_name" content="Example App" />
    <link rel="icon" href="/icon.ico" />
    <link data-seo-tag rel="canonical" href="https://old.test" />
  </head>
  <body><div id="root"></div></body>
</html>`;

describe("injectHead", () => {
  it("puts the tags at the end of the head, marked as the ones for the crawlers", () => {
    const html = injectHead(shell, {
      meta: [
        { title: "Novo" },
        { name: "robots", content: "noindex, nofollow" },
      ],
      links: [],
    });

    expect(html).toContain("<title data-seo-tag>Novo</title>");
    expect(html).toContain(
      '<meta data-seo-tag name="robots" content="noindex, nofollow" />',
    );
    expect(html.lastIndexOf("data-seo-tag")).toBeLessThan(
      html.indexOf("</head>"),
    );
  });

  it("replaces the tags the shell already has instead of repeating them", () => {
    const html = injectHead(shell, {
      meta: [
        { title: "Novo" },
        { name: "description", content: "nova" },
        { property: "og:title", content: "Novo" },
      ],
      links: [{ rel: "canonical", href: "https://new.test" }],
    });

    expect(html.match(/<title/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).not.toContain("do site");
    expect(html).not.toContain("old.test");
  });

  it("keeps the tags of the site that the page does not change", () => {
    const html = injectHead(shell, { meta: [{ title: "Novo" }], links: [] });

    expect(html).toContain('property="og:site_name" content="Example App"');
    expect(html).toContain('name="description" content="do site"');
    expect(html).toContain('<meta charset="utf-8" />');
    expect(html).toContain('<link rel="icon" href="/icon.ico" />');
    expect(html).toContain('<body><div id="root"></div></body>');
  });

  it("escapes what a user wrote, so a title can't close the tag or add one", () => {
    const html = injectHead(shell, {
      meta: [
        { title: "</title><script>alert(1)</script>" },
        { name: "description", content: '"><img src=x onerror=alert(1)>' },
      ],
      links: [],
    });

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;/title&gt;&lt;script&gt;");
    expect(html).toContain("&quot;&gt;&lt;img");
  });

  it("does not read $ in a text as a replacement pattern", () => {
    const html = injectHead(shell, {
      meta: [{ title: "Custa $& e $1" }],
      links: [],
    });

    expect(html).toContain("Custa $&amp; e $1");
  });

  it("gives the page back when it has no head", () => {
    expect(
      injectHead("<p>sem head</p>", { meta: [{ title: "x" }], links: [] }),
    ).toBe("<p>sem head</p>");
  });
});
