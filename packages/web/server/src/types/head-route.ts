import type { z } from "zod";

import type { HeadTags } from "@web/seo/head";

import type { ApiClient } from "../utils/head-route/create-api-client";

/** What `load` of a head route receives. */
export interface HeadRouteLoadContext<TParams extends z.ZodType> {
  /** The params of the address, checked by the `params` schema. */
  params: z.infer<TParams>;
  /** Asks the API of the app. */
  api: ApiClient;
}

/** Options of {@link defineHeadRoute}. */
export interface DefineHeadRouteOptions<TParams extends z.ZodType, TContent> {
  /** The params of the address (`[postId]` in the file name) must pass it, or the page gets the tags of the site. */
  params: TParams;
  /** The content of the page, or `null` when there is nothing to show (not found, private, the API is down): the page then gets the tags of the site. */
  load: (context: HeadRouteLoadContext<TParams>) => Promise<TContent | null>;
  /** The tags of the page, from its content. */
  tags: (content: TContent) => Partial<HeadTags>;
  /** Whether search engines may index the page. When it is not, the response says so in a header too. @defaultValue false */
  indexable?: boolean;
  /** The `Cache-Control` of a page that has its content. A page with nothing to show is never cached. @defaultValue "public, max-age=3600" */
  cacheControl?: string;
  /** The tags of a page with nothing to show. @defaultValue a `noindex` tag */
  fallbackTags?: Partial<HeadTags>;
}
