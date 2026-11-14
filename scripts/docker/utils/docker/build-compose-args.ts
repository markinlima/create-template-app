import type { ComposeRunOptions } from "../../types/compose-run-options";

/**
 * The arguments of `docker compose` for a run: the file, the profiles and the command, in this order.
 *
 * @param options - See {@link ComposeRunOptions}; only the file, the profiles and the arguments are used.
 * @returns What follows `docker` in the command line.
 * @example
 * buildComposeArgs({ cwd, profiles: ["web"], args: ["up", "-d"] });
 * // ["compose", "--profile", "web", "up", "-d"]
 */
export function buildComposeArgs({
  file,
  profiles = [],
  args,
}: Pick<ComposeRunOptions, "file" | "profiles" | "args">): string[] {
  return [
    "compose",
    ...(file ? ["-f", file] : []),
    ...profiles.flatMap((profile) => ["--profile", profile]),
    ...args,
  ];
}
