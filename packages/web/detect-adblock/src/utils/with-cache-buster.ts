/**
 * Adds a changing query to the address: a cached answer would hide a blocker turned on after the first load.
 *
 * @param url - Address that may already have a query.
 * @returns The address with a `bait` param set to the current time.
 */
export function withCacheBuster(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}bait=${Date.now()}`;
}
