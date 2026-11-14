import { $ } from "bun";

/**
 * Checks that the checked-out commit is part of a branch of origin.
 *
 * @param branch - Branch name, without the `origin/` prefix.
 */
export async function isOnBranch(branch: string) {
  const result =
    await $`git merge-base --is-ancestor HEAD ${`origin/${branch}`}`
      .nothrow()
      .quiet();
  return result.exitCode === 0;
}
