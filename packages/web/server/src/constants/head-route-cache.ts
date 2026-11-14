/**
 * `Cache-Control` of a page with content: the browser keeps it for an hour, because what the API says rarely changes.
 * @defaultValue "public, max-age=3600"
 */
export const HEAD_ROUTE_CACHE_CONTROL = "public, max-age=3600";

/**
 * `Cache-Control` of a page with nothing to show: it may be the API down for a moment, so it is not kept.
 * @defaultValue "no-cache"
 */
export const HEAD_ROUTE_FALLBACK_CACHE_CONTROL = "no-cache";
