import { $ } from "bun";

import { DOCKER_TEST_SCRIPT } from "../../constants/docker-test-script";
import type { AffectedTasksJson } from "../../types/affected-tasks";
import { parseAffectedPackages } from "./parse-affected-packages";
import { turboSpecifier } from "./turbo-specifier";

/**
 * Lists the packages changed since a commit that have a Docker test stack task, asking Turborepo through `bunx`.
 *
 * @param base - Commit to compare against (see `scm-base.ts`).
 */
export async function affectedPackages(base: string) {
  const turbo = turboSpecifier(await Bun.file("package.json").json());
  const json: AffectedTasksJson =
    await $`bunx ${turbo} query affected --tasks ${DOCKER_TEST_SCRIPT} --base ${base}`
      .quiet()
      .json();
  return parseAffectedPackages(json);
}
