/**
 * Turn the address of the bait script into the name of the file in the output folder.
 *
 * @param path - Address starting with a slash, e.g. `/ads/ads.js`.
 * @returns The same path without the leading slash and the query, e.g. `ads/ads.js`.
 */
export function toBaitFileName(path: string) {
  return path.replace(/^\/+/, "").split(/[?#]/)[0] ?? "";
}
