import type { z } from "zod";

import { buildMeta, NO_INDEX } from "@web/seo/head";

import {
  HEAD_ROUTE_CACHE_CONTROL,
  HEAD_ROUTE_FALLBACK_CACHE_CONTROL,
} from "../../constants/head-route-cache";
import type { DefineHeadRouteOptions } from "../../types/head-route";
import type { ApiClient } from "./create-api-client";
import { loadHeadRouteContent } from "./load-head-route-content";
import { rejectUnlessReadMethod } from "./reject-unless-read-method";
import { renderHeadPage } from "./render-head-page";

/** Options of {@link buildHeadRouteResponse}. */
export interface BuildHeadRouteResponseOptions<
  TParams extends z.ZodType,
  TContent,
> {
  route: DefineHeadRouteOptions<TParams, TContent>;
  request: Request;
  /** The params of the address, before they are checked. */
  rawParams: unknown;
  /** The `index.html` of the build, or `undefined` when it has none. */
  shell: string | undefined;
  securityHeaders: Record<string, string>;
  api: ApiClient;
}

/**
 * The answer to a request for a page whose tags come from data. With no content (params that do not pass, nothing to show, the API down) it
 * is the shell with a `noindex` tag, or the `fallbackTags` of the route, and it is never cached: the app then shows its own message.
 */
export async function buildHeadRouteResponse<
  TParams extends z.ZodType,
  TContent,
>({
  route,
  request,
  rawParams,
  shell,
  securityHeaders,
  api,
}: BuildHeadRouteResponseOptions<TParams, TContent>) {
  const rejected = rejectUnlessReadMethod(request);

  if (rejected) {
    return rejected;
  }

  if (!shell) {
    return new Response("The build has no index.html", { status: 500 });
  }

  const content = await loadHeadRouteContent({
    rawParams,
    options: route,
    api,
  });

  if (content === null) {
    return renderHeadPage({
      shell,
      tags: route.fallbackTags ?? buildMeta({ robots: NO_INDEX }),
      headers: securityHeaders,
      cacheControl: HEAD_ROUTE_FALLBACK_CACHE_CONTROL,
      indexable: false,
    });
  }

  return renderHeadPage({
    shell,
    tags: route.tags(content),
    headers: securityHeaders,
    cacheControl: route.cacheControl ?? HEAD_ROUTE_CACHE_CONTROL,
    indexable: route.indexable ?? false,
  });
}
