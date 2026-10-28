import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AlertMarkdown } from "./alert-markdown";

function render(markdown: string) {
  return renderToStaticMarkup(<AlertMarkdown>{markdown}</AlertMarkdown>);
}

describe("AlertMarkdown", () => {
  it("renders the formatting of the text", () => {
    const html = render("## Title\n\nSome **bold** text.\n\n- one\n- two");

    expect(html).toContain("<h2>Title</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<li>one</li>");
  });

  it("opens links in another tab, without giving the page to the link", () => {
    const html = render("[the site](https://example.com)");

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("drops the address of a link that runs code", () => {
    const html = render("[click](javascript:alert(1))");

    expect(html).not.toContain("javascript:");
  });

  it("renders images that load late and fit the dialog", () => {
    const html = render("![a cat](https://example.com/cat.png)");

    expect(html).toContain('src="https://example.com/cat.png"');
    expect(html).toContain('alt="a cat"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain("max-w-full");
  });

  it("shows raw HTML as plain text instead of rendering it", () => {
    const html = render(
      'Hello <script>alert(1)</script> <img src="x" onerror="alert(1)"> world',
    );

    // ? Escaped, so it is text on the screen and nothing in the page: no element is created from it.
    expect(html).not.toContain("<script");
    expect(html).not.toContain('<img src="x"');
    expect(html).toContain("&lt;script&gt;");
  });
});
