/**
 * The name of the update file without leading slashes, so the build and the checker agree on it whether or not it was given one.
 *
 * @param fileName - The file name as configured, e.g. `"/version.json"` or `"version.json"`.
 * @returns The name without its leading slashes, e.g. `"version.json"`.
 */
export function normalizeFileName(fileName: string) {
  return fileName.replace(/^\/+/, "");
}
