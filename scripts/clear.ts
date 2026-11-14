import { readdir, rm } from "node:fs/promises";
import path from "node:path";

import config from "../package.json" with { type: "json" };

const directories = ["node_modules", "dist", "build"];
const packages = config.workspaces.packages.map(
  (pkg) => pkg.split("/")[0] ?? pkg,
);
const root = path.resolve(import.meta.dirname, "..");

console.log("Cleaning workspace...");
console.log(`Packages: ${packages.join(", ")}`);
console.log(`Directories: ${directories.join(", ")}`);

for (const pkg of packages) {
  const apps = await readdir(path.join(root, pkg));

  for (const app of apps) {
    const appPath = path.join(root, pkg, app);
    for (const dir of directories) {
      console.log(`Removing ${path.join(appPath, dir)}...`);
      await rm(path.join(appPath, dir), { recursive: true, force: true });
    }
  }
}
