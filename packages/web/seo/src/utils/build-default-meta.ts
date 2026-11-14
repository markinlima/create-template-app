import { buildMeta } from "../head";
import type { SeoSite } from "../types/meta";

/** Options of {@link buildDefaultMeta}. */
export interface BuildDefaultMetaOptions {
  /** The public address of the site, e.g. `https://example.com`. */
  siteUrl: string;
  site: SeoSite;
}

/**
 * The tags every page shares: title, description, Open Graph and Twitter. A page changes only the ones it needs (see `buildPageMeta`).
 * The image is absolute because the crawlers of the previews do not resolve paths.
 */
export function buildDefaultMeta({ siteUrl, site }: BuildDefaultMetaOptions) {
  const origin = siteUrl.replace(/\/+$/, "");

  return buildMeta({
    title: site.title,
    description: site.description,
    keywords: site.keywords,
    author: site.name,
    applicationName: site.name,
    referrer: "origin-when-cross-origin",
    siteName: site.name,
    locale: site.locale,
    type: "website",
    url: origin,
    image: `${origin}${site.imagePath}`,
    imageWidth: 1200,
    imageHeight: 630,
    twitterCard: "summary_large_image",
  }).meta;
}
