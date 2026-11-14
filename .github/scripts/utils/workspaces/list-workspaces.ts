import { dirname, join } from "node:path";

import { Glob } from "bun";

import type { PackageJson } from "../../types/package-json";
import type { Workspace } from "../../types/workspace";
import { workspacePatterns } from "./workspace-patterns";

/**
 * Lists the workspaces from the globs of the root package.json, so a job can find an app's folder and scripts
 * without installing the dependencies (and without Turborepo).
 *
 * @param root - Folder of the root package.json.
 * @returns The workspaces, sorted by name.
 */
export async function listWorkspaces(root = ".") {
  const rootPackage: PackageJson = await Bun.file(
    join(root, "package.json"),
  ).json();

  const workspaces: Workspace[] = [];
  for (const pattern of workspacePatterns(rootPackage)) {
    const glob = new Glob(`${pattern}/package.json`);
    for await (const file of glob.scan({ cwd: root, onlyFiles: true })) {
      const pkg: PackageJson = await Bun.file(join(root, file)).json();
      if (pkg.name) {
        workspaces.push({
          name: pkg.name,
          path: dirname(file),
          scripts: pkg.scripts ?? {},
        });
      }
    }
  }
  return workspaces.sort((a, b) => a.name.localeCompare(b.name));
}
