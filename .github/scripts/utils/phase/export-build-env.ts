import { join } from "node:path";

import { $ } from "bun";

import { installPhase } from "./install-phase";

export interface ExportBuildEnvOptions {
  /** Phase app whose envs are exported. */
  appId: string;
  /** Phase environment to read, e.g. `production` or `staging`. */
  environment: string;
  /** Private folder for the Phase binary and the env file (the runner's temp folder). */
  tempDir: string;
}

/**
 * Exports the build-time envs of an app from Phase into a private dotenv file (mode 0600).
 * The file goes to the image build as a BuildKit secret, never as a build arg, so nothing ends up in the image history.
 *
 * @param options - See {@link ExportBuildEnvOptions}.
 * @returns The path of the env file and how many variables it holds.
 */
export async function exportBuildEnv(options: ExportBuildEnvOptions) {
  const phase = await installPhase(options.tempDir);
  const envFile = join(options.tempDir, "build.env");

  const dotenv =
    await $`${phase} secrets export --app-id ${options.appId} --env ${options.environment} --format dotenv`
      .quiet()
      .text();
  await Bun.write(envFile, dotenv, { mode: 0o600 });

  const count = dotenv.split("\n").filter((line) => line.includes("=")).length;
  return { path: envFile, count };
}
