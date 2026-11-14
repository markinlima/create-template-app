/** Options of {@link buildSitemap}. */
export interface BuildSitemapOptions {
  /** The public address of the site, e.g. `https://example.com`. */
  siteUrl: string;
  /** The addresses of the pages, e.g. `/about-us`. The home page (`/`) is always listed. */
  addresses: string[];
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * The `sitemap.xml` of the site: the home page and each static page of the build. Only the address is written: search engines ignore
 * `changefreq` and `priority`, and a `lastmod` that is not the date the page really changed is worse than none.
 */
export function buildSitemap({ siteUrl, addresses }: BuildSitemapOptions) {
  const origin = siteUrl.replace(/\/+$/, "");
  const locations = [...new Set(["/", ...addresses])].map((address) =>
    address === "/" ? `${origin}/` : `${origin}${address}`,
  );
  const urls = locations
    .map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
