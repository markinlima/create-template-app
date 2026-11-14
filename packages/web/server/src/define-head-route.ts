import { defineHandler } from "nitro";
import type { z } from "zod";

import { getApiClient } from "./lib/get-api-client";
import { getResolvedConfig } from "./lib/get-resolved-config";
import { getShell } from "./lib/get-shell";
import { isDev } from "./lib/runtime";
import type { DefineHeadRouteOptions } from "./types/head-route";
import { buildHeadRouteResponse } from "./utils/head-route/build-head-route-response";

/**
 * A page of the app whose tags come from data (a post, a profile): the file in `server/routes/` that has the shape of its address is
 * `export default defineHeadRoute({ params, load, tags })`. It answers with the shell and the tags of the content, and with the tags
 * of the site when there is nothing to show. A route with a handler of its own takes precedence over the app fallback.
 */
export function defineHeadRoute<TParams extends z.ZodType, TContent>(
  route: DefineHeadRouteOptions<TParams, TContent>,
) {
  return defineHandler(async (event) => {
    // NOTE: `vite dev` has no build, so the page is the dev server's `index.html` (the home), without the tags of the content
    if (isDev) {
      const shell = await fetch(new URL("/", event.req.url), {
        headers: { accept: "text/html" },
      });

      return new Response(shell.body, {
        status: shell.status,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return buildHeadRouteResponse({
      route,
      request: event.req,
      rawParams: event.context.params,
      shell: await getShell(),
      securityHeaders: getResolvedConfig().securityHeaders,
      api: getApiClient(),
    });
  });
}
