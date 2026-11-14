import { $ } from "bun";

/**
 * Runs a git command and returns its trimmed output.
 *
 * @param args - Arguments of `git`.
 * @returns The output, or undefined when the command fails.
 */
export async function gitOutput(args: string[]) {
  const result = await $`git ${args}`.nothrow().quiet();
  return result.exitCode === 0 ? result.text().trim() : undefined;
}
