import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Seo } from "../create-seo";
import { SEO_TAG_ATTRIBUTE } from "../head";
import { buildSitemap } from "./utils/build-sitemap";
import { readPrerenderPages } from "./utils/read-routes/read-prerender-pages";

/** Options of {@link prerenderStaticPages}. */
export interface PrerenderStaticPagesOptions {
  seo: Seo;
  siteUrl: string;
  /** Where the build wrote the app: its `index.html` is read, and the pages are written next to it. */
  outDir: string;
  /** The folder of the route files, with their absolute path. */
  routesDirectory: string;
}

/**
 * Writes the tags of the site into `index.html` and, for each route that declares `prerender: true` (with its `seo`), an `index.html` in its address folder
 * with the tags of the page, and the `sitemap.xml` that lists them, so it can't go stale. The web server serves those folders for their
 * addresses, so the pages need no server code.
 */
export async function prerenderStaticPages({
  seo,
  siteUrl,
  outDir,
  routesDirectory,
}: PrerenderStaticPagesOptions) {
  const indexPath = path.join(outDir, "index.html");
  const shell = await readFile(indexPath, "utf8");

  if (shell.includes(SEO_TAG_ATTRIBUTE)) {
    throw new Error(
      "The build already has the tags written into it. Run the build again to start from a clean index.html.",
    );
  }

  await writeFile(indexPath, seo.buildStaticPageHtml({ shell, siteUrl }));

  const pages = await readPrerenderPages(routesDirectory);

  for (const { address, page } of pages) {
    const folder = path.join(outDir, address);

    await mkdir(folder, { recursive: true });
    await writeFile(
      path.join(folder, "index.html"),
      seo.buildStaticPageHtml({ shell, siteUrl, path: address, page }),
    );
  }

  // NOTE: a `noIndex` page is written but left out of the sitemap
  const addresses = pages
    .filter(({ page }) => !page.noIndex)
    .map(({ address }) => address);

  await writeFile(
    path.join(outDir, "sitemap.xml"),
    buildSitemap({ siteUrl, addresses }),
  );

  return pages.map(({ address }) => address);
}
