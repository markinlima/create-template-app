import type { Program } from "estree";
import { parseSync } from "vite";
import { z } from "zod";

import type { PageSeo } from "../../../schemas/page-seo";
import { staticDataSchema } from "../../schemas/static-data";
import { evaluateLiteral } from "./evaluate-literal";
import { findRouteStaticData } from "./find-route-static-data";
import { getRouteAddress } from "./get-route-address";

/** A route that asks to be written at build time: its address and what it says. */
export interface PrerenderPage {
  /** The address of the page, as the browser sees it (`/about-us`). */
  address: string;
  page: PageSeo;
}

/**
 * The page a route asks the build to write: a route file that declares `staticData: { seo, prerender: true }`, with the address the route
 * has. A route without `prerender: true` is not written (its `seo` is only for the tags the router writes in the browser) and gives
 * `undefined`. The file is parsed, never run, so the whole `staticData` has to be literal values.
 */
export function readPrerenderPage({
  filename,
  source,
}: {
  filename: string;
  source: string;
}): PrerenderPage | undefined {
  const { program: parsed, errors } = parseSync(filename, source);

  if (errors.length > 0) {
    throw new Error(
      `${filename} can't be read: ${errors[0]?.message ?? "a syntax error"}.`,
    );
  }

  // NOTE: the parser returns the ESTree shape at runtime but types its nodes differently
  const route = findRouteStaticData(parsed as unknown as Program);

  if (!route?.staticData) {
    return undefined;
  }

  const result = staticDataSchema.safeParse(evaluateLiteral(route.staticData));

  if (!result.success) {
    throw new Error(
      `The staticData of ${route.routePath} is not valid: ${z.prettifyError(result.error)}`,
    );
  }

  const { prerender, seo } = result.data;

  if (!prerender) {
    return undefined;
  }

  if (!seo) {
    throw new Error(
      `${route.routePath} asks to be prerendered but has no seo to write.`,
    );
  }

  return { address: getRouteAddress(route.routePath), page: seo };
}
