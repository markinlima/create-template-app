import { describe, expect, it } from "bun:test";

import { buildMeta } from "@web/seo/head";

import { renderHeadPage } from "./render-head-page";

const shell =
  "<!doctype html><html><head><title>Site</title></head><body></body></html>";
const base = { shell, headers: {}, cacheControl: "public, max-age=60" };

describe("renderHeadPage", () => {
  it("puts the tags of the page into the shell and replaces the title", async () => {
    const response = renderHeadPage({
      ...base,
      tags: buildMeta({ title: "Página boa | Example App" }),
      indexable: true,
    });
    const html = await response.text();

    expect(html).toContain("<title");
    expect(html).toContain("Página boa | Example App");
    expect(html).not.toContain("<title>Site</title>");
    expect(html).toContain("</body></html>");
  });

  it("sends the html with the headers it was given and the cache rule of the page", () => {
    const response = renderHeadPage({
      ...base,
      tags: buildMeta({}),
      headers: { "x-content-type-options": "nosniff" },
      indexable: true,
    });

    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8",
    );
    expect(response.headers.get("cache-control")).toBe("public, max-age=60");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("tells search engines in a header not to index a page that is not indexable", () => {
    const response = renderHeadPage({
      ...base,
      tags: buildMeta({}),
      indexable: false,
    });

    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("sends no such header for an indexable page", () => {
    const response = renderHeadPage({
      ...base,
      tags: buildMeta({}),
      indexable: true,
    });

    expect(response.headers.get("x-robots-tag")).toBeNull();
  });

  it("escapes what a user wrote", async () => {
    const response = renderHeadPage({
      ...base,
      tags: buildMeta({ title: `<script>alert("x")</script>` }),
      indexable: true,
    });

    expect(await response.text()).not.toContain("<script>alert");
  });
});
