import { ALL_SUITES } from "../../constants/all-suites";
import { DOCKER_TEST_SCRIPT } from "../../constants/docker-test-script";
import type { AppTarget } from "../../types/app-target";
import type { Workspace } from "../../types/workspace";
import { CiError } from "../github/ci-error";

export interface SelectTargetsOptions {
  workspaces: Workspace[];
  /** Names to keep. Undefined keeps every workspace. */
  names?: string[];
  /** Suites requested. An app only runs the ones it has a `test:<suite>` script for. */
  suites: string[];
}

/**
 * Selects the apps whose Docker test stack runs, with the suites each one has.
 *
 * @param options - See {@link SelectTargetsOptions}.
 * @returns One target per app with a `docker:test` script and at least one requested suite.
 * @throws {CiError} When a name or a suite is unknown.
 */
export function selectTargets(options: SelectTargetsOptions): AppTarget[] {
  const { workspaces, names, suites } = options;

  const unknown = (names ?? []).filter(
    (name) => !workspaces.some((workspace) => workspace.name === name),
  );
  if (unknown.length > 0) {
    throw new CiError(`Unknown workspace(s): ${unknown.join(", ")}`);
  }

  const invalid = suites.filter((suite) => !ALL_SUITES.includes(suite));
  if (invalid.length > 0) {
    throw new CiError(
      `Unknown suite(s): ${invalid.join(", ")}. Use ${ALL_SUITES.join(", ")}.`,
    );
  }

  return workspaces
    .filter((workspace) => !names || names.includes(workspace.name))
    .filter((workspace) => !!workspace.scripts[DOCKER_TEST_SCRIPT])
    .map((workspace) => ({
      name: workspace.name,
      path: workspace.path,
      suites: suites
        .filter((suite) => !!workspace.scripts[`test:${suite}`])
        .join(","),
    }))
    .filter((target) => target.suites !== "");
}
