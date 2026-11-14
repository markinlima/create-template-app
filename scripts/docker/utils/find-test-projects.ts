import path from "node:path";

import { PROJECT_CONFIG } from "../constants/projects";
import { ROOT_DIR } from "../constants/root-dir";
import { TEST_COMPOSE_FILE } from "../constants/test-stack";
import type { ProjectConfig } from "../types/project-config";

/**
 * Lists the projects that run their tests in Docker: the ones whose folder has a test compose file.
 *
 * @param projects - The projects to look at, from `projects.json`.
 * @defaultValue every project of `projects.json`
 * @param root - The root of the repo, where the folders of the projects are.
 * @defaultValue the root of this repo
 * @returns The projects with tests, in the order of `projects`.
 */
export async function findTestProjects(
  projects: ProjectConfig[] = PROJECT_CONFIG,
  root = ROOT_DIR,
): Promise<ProjectConfig[]> {
  const found: ProjectConfig[] = [];

  for (const project of projects) {
    const testCompose = path.join(root, project.path, TEST_COMPOSE_FILE);

    if (await Bun.file(testCompose).exists()) {
      found.push(project);
    }
  }

  return found;
}
