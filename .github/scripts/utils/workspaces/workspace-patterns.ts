import type { PackageJson } from "../../types/package-json";

/**
 * Returns the workspace globs of the root package.json, in both forms it accepts (an array, or `{ packages }`).
 *
 * @param rootPackage - The root package.json.
 */
export function workspacePatterns(rootPackage: PackageJson) {
  const { workspaces } = rootPackage;
  if (Array.isArray(workspaces)) {
    return workspaces;
  }
  return workspaces?.packages ?? [];
}
