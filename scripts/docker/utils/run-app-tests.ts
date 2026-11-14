import path from "node:path";

import {
  TEST_COMPOSE_FILE,
  TEST_RUNNER_SERVICE,
} from "../constants/test-stack";
import type { ProjectConfig } from "../types/project-config";
import { buildTestStackEnv } from "./docker/build-test-stack-env";
import { runCompose } from "./docker/run-compose";

/** Options of {@link runAppTests}. */
export interface RunAppTestsOptions {
  /** The project, from `projects.json`: its `id` names the stack and its `path` is where the tests run. */
  project: ProjectConfig;
  /** The script of the app the tests runner runs, e.g. `test:unit`. */
  target: string;
  /** The root of the repo. */
  root: string;
  /**
   * Leave the stack up after the run, to look at it.
   * @defaultValue false
   */
  keep?: boolean;
}

/**
 * Runs the tests of an app in its own Docker stack: builds the test image, starts the stack, waits for the tests runner and brings the
 * stack down. The stack has a network of its own, apart from the dev stack.
 *
 * @param options - See {@link RunAppTestsOptions}.
 * @returns The exit code of the tests runner (`0` when the tests passed).
 */
export async function runAppTests({
  project,
  target,
  root,
  keep = false,
}: RunAppTestsOptions): Promise<number> {
  const stack = {
    cwd: path.join(root, project.path),
    file: `./${TEST_COMPOSE_FILE}`,
    profiles: [`${project.id}-test`],
    env: buildTestStackEnv(project.id, target),
  };

  const build = await runCompose({ ...stack, args: ["build"] });

  if (build.exitCode !== 0) {
    return build.exitCode;
  }

  const run = await runCompose({
    ...stack,
    args: [
      "up",
      "--no-build",
      "--abort-on-container-exit",
      "--exit-code-from",
      TEST_RUNNER_SERVICE,
      "--remove-orphans",
    ],
  });

  if (run.exitCode !== 0) {
    await runCompose({ ...stack, args: ["logs", "--tail=100"] });
  }

  if (!keep) {
    await runCompose({
      ...stack,
      args: ["down", "-v", "--remove-orphans"],
      quiet: true,
    });
  }

  return run.exitCode;
}
