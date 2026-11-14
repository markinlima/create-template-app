import type { PackageJson } from "../../types/package-json";

/**
 * The package `bunx` runs to get Turborepo without installing the workspace: the range the root package.json asks for
 * (`turbo@^2.11.7`). Without a range it takes the latest, which is the only thing it can do.
 *
 * @param rootPackage - The root package.json.
 */
export function turboSpecifier(rootPackage: PackageJson) {
  const range =
    rootPackage.devDependencies?.turbo ?? rootPackage.dependencies?.turbo;

  return range ? `turbo@${range}` : "turbo";
}
