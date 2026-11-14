import { describe, expect, it } from "bun:test";

import { TEST_SITE } from "../test/site";
import { buildStaticPageHtml } from "./build-static-page-html";

const shell = `<!doctype html><html><head><meta charset="utf-8" /></head><body></body></html>`;

describe("buildStaticPageHtml", () => {
  it("writes the tags of the site before </head> when the address is the home", () => {
    const html = buildStaticPageHtml({
      shell,
      siteUrl: "https://site.test",
      site: TEST_SITE,
    });

    expect(html).toContain(`<title data-seo-tag>${TEST_SITE.title}</title>`);
    expect(html).toContain(
      `<link data-seo-tag rel="canonical" href="https://site.test" />`,
    );
    expect(html.indexOf("data-seo-tag")).toBeLessThan(html.indexOf("</head>"));
  });

  it("writes the title and the canonical of the page, with the address of the page", () => {
    const html = buildStaticPageHtml({
      shell,
      siteUrl: "https://site.test",
      site: TEST_SITE,
      path: "/about-us",
      page: { title: "Sobre nós", description: "Quem somos." },
    });

    expect(html).toContain(
      "<title data-seo-tag>Sobre nós | Example App</title>",
    );
    expect(html).toContain(
      `<link data-seo-tag rel="canonical" href="https://site.test/about-us" />`,
    );
    expect(html).toContain(
      `<meta data-seo-tag property="og:url" content="https://site.test/about-us" />`,
    );
    expect(html).toContain(
      `<meta data-seo-tag name="twitter:url" content="https://site.test/about-us" />`,
    );
  });

  it("escapes what the page says, so a title can't break the tag", () => {
    const html = buildStaticPageHtml({
      shell,
      siteUrl: "https://site.test",
      site: TEST_SITE,
      path: "/x",
      page: { title: `"Quebrou" <script>` },
    });

    expect(html).toContain("&quot;Quebrou&quot; &lt;script&gt; | Example App");
    expect(html).not.toContain("<script>");
  });

  it("fails when the shell has no </head> to write into", () => {
    expect(() =>
      buildStaticPageHtml({
        shell: "<html></html>",
        siteUrl: "https://site.test",
        site: TEST_SITE,
      }),
    ).toThrow("no </head>");
  });
});
