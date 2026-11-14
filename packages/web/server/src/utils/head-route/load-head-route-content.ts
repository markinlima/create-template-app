import type { z } from "zod";

import type { DefineHeadRouteOptions } from "../../types/head-route";
import type { ApiClient } from "./create-api-client";

/** Options of {@link loadHeadRouteContent}. */
export interface LoadHeadRouteContentOptions<
  TParams extends z.ZodType,
  TContent,
> {
  /** The params the address came with, before they are checked. */
  rawParams: unknown;
  options: Pick<DefineHeadRouteOptions<TParams, TContent>, "params" | "load">;
  api: ApiClient;
}

/**
 * The content of the page, or `null` when there is nothing to show: params that do not pass the schema, or a `load` that gives `null` or
 * fails. A failure is logged and never reaches the visitor, who gets the page with the tags of the site.
 */
export async function loadHeadRouteContent<
  TParams extends z.ZodType,
  TContent,
>({ rawParams, options, api }: LoadHeadRouteContentOptions<TParams, TContent>) {
  const params = options.params.safeParse(rawParams);

  if (!params.success) {
    return null;
  }

  try {
    return await options.load({ params: params.data, api });
  } catch (error) {
    console.warn(
      "[web-server] the load of a page failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
