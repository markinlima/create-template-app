import type { PageSeo } from "./schemas/page-seo";
import type { SeoSite } from "./types/meta";
import { buildDefaultMeta } from "./utils/build-default-meta";
import { buildPageMeta } from "./utils/build-page-meta";
import type { BuildStaticPageHtmlOptions } from "./utils/build-static-page-html";
import { buildStaticPageHtml } from "./utils/build-static-page-html";

/**
 * The SEO of an app: the functions bound to what the app says about its site, so the pages call `buildPageMeta(page)` and the build calls
 * `buildStaticPageHtml({ shell, siteUrl, path, page })` without passing the site each time.
 */
export function createSeo(site: SeoSite) {
  return {
    site,
    buildPageMeta: (page: PageSeo) => buildPageMeta({ page, site }),
    buildDefaultMeta: (options: { siteUrl: string }) =>
      buildDefaultMeta({ ...options, site }),
    buildStaticPageHtml: (options: Omit<BuildStaticPageHtmlOptions, "site">) =>
      buildStaticPageHtml({ ...options, site }),
  };
}

/** The functions of a site, bound to it by {@link createSeo}. */
export type Seo = ReturnType<typeof createSeo>;
