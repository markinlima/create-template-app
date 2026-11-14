import { buildMeta, injectHead, mergeMeta } from "../head";
import type { PageSeo } from "../schemas/page-seo";
import type { SeoSite } from "../types/meta";
import { buildDefaultMeta } from "./build-default-meta";
import { buildPageMeta } from "./build-page-meta";

/** Options of {@link buildStaticPageHtml}. */
export interface BuildStaticPageHtmlOptions {
  /** The `index.html` the build produced, with nothing of this library in it. */
  shell: string;
  /** The public address of the site. */
  siteUrl: string;
  site: SeoSite;
  /** The address of the page (`/about-us`). Without it, the page is the home: the tags of the site. */
  path?: string;
  page?: PageSeo;
}

/** The shell with the tags of the site, and of the page when it has them, replacing the ones it has: the HTML crawlers read. */
export function buildStaticPageHtml({
  shell,
  siteUrl,
  site,
  path = "",
  page,
}: BuildStaticPageHtmlOptions) {
  const origin = siteUrl.replace(/\/+$/, "");
  const url = `${origin}${path}`;
  const meta = mergeMeta(
    buildDefaultMeta({ siteUrl, site }),
    page ? buildPageMeta({ page, site }) : [],
    buildMeta({ url }).meta,
  );

  if (!/<\/head>/i.test(shell)) {
    throw new Error("The shell has no </head> to put the tags before.");
  }

  return injectHead(shell, {
    meta,
    links: [{ rel: "canonical", href: url }],
  });
}
