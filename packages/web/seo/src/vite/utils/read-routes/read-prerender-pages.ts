import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { PrerenderPage } from "./read-prerender-page";
import { readPrerenderPage } from "./read-prerender-page";

/**
 * The pages the build writes: each route file of the routes folder (at any depth; a file whose name starts with `-` is ignored, like the
 * router does) that declares `prerender: true`, one per address.
 */
export async function readPrerenderPages(
  routesDirectory: string,
): Promise<PrerenderPage[]> {
  const pages: PrerenderPage[] = [];
  const entries = await readdir(routesDirectory, { recursive: true });
  const files = entries.filter(
    (entry) => /\.tsx?$/.test(entry) && !path.basename(entry).startsWith("-"),
  );

  for (const file of files) {
    const filename = path.join(routesDirectory, file);
    const source = await readFile(filename, "utf8");

    if (!source.includes("createFileRoute(")) {
      continue;
    }

    const route = readPrerenderPage({ filename, source });

    if (!route) {
      continue;
    }

    if (pages.some((page) => page.address === route.address)) {
      throw new Error(`Two routes declare the static page ${route.address}.`);
    }

    pages.push(route);
  }

  return pages;
}
