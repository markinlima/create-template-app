import { buildMeta, NO_INDEX } from "../head";
import type { PageSeo } from "../schemas/page-seo";
import type { SeoSite } from "../types/meta";

/** Options of {@link buildPageMeta}. */
export interface BuildPageMetaOptions {
  page: PageSeo;
  site: SeoSite;
}

/**
 * The meta tags a page changes. The tags every page shares (see `buildDefaultMeta`) are already there and the tags of a page override the
 * ones of the same name, so a page only says what is its own.
 */
export function buildPageMeta({
  page: { title, description, noIndex },
  site,
}: BuildPageMetaOptions) {
  return buildMeta({
    title: `${title} | ${site.name}`,
    description,
    robots: noIndex ? NO_INDEX : undefined,
  }).meta;
}
