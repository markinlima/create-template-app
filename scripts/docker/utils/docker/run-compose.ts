import type { ComposeResult } from "../../types/compose-result";
import type { ComposeRunOptions } from "../../types/compose-run-options";
import { buildComposeArgs } from "./build-compose-args";

/**
 * Runs `docker compose` and waits for it. It never throws: a failure comes back as the exit code.
 *
 * @param options - See {@link ComposeRunOptions}.
 * @returns See {@link ComposeResult}.
 * @example
 * await runCompose({ cwd: ROOT_DIR, profiles: ["backend"], args: ["up", "-d"], quiet: true });
 */
export async function runCompose(
  options: ComposeRunOptions,
): Promise<ComposeResult> {
  const { cwd, env = {}, quiet = false } = options;

  const process = Bun.spawn(["docker", ...buildComposeArgs(options)], {
    cwd,
    env: { ...Bun.env, ...env },
    stdin: "ignore",
    stdout: quiet ? "ignore" : "inherit",
    stderr: quiet ? "pipe" : "inherit",
  });

  const [exitCode, stderr] = await Promise.all([
    process.exited,
    quiet ? new Response(process.stderr).text() : Promise.resolve(""),
  ]);

  return { exitCode, stderr };
}
