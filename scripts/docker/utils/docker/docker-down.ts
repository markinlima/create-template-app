import { EXTRAS, PROJECTS, SERVICES_PROFILE } from "../../constants/projects";
import { ROOT_DIR } from "../../constants/root-dir";
import { runCompose } from "./run-compose";

/** Options of {@link dockerDown}. */
export interface DockerDownOptions {
  /** Also remove the volumes of the services (the data). */
  cleanVolumes: boolean;
}

/**
 * Stops and removes every container of the project, whatever profile started it.
 *
 * @param options - See {@link DockerDownOptions}.
 */
export async function dockerDown({ cleanVolumes }: DockerDownOptions) {
  await runCompose({
    cwd: ROOT_DIR,
    profiles: [
      SERVICES_PROFILE,
      ...[...PROJECTS, ...EXTRAS].map((project) => project.value),
    ],
    args: ["down", ...(cleanVolumes ? ["-v"] : []), "--remove-orphans"],
    quiet: true,
  });
}
