import type { ReleaseAppConfig } from "../../types/release-app-config";

export interface BuildReleaseConfigOptions {
  /** The projects of `projects.json`, each one with its `id` and optional release ids. */
  projects: Array<ReleaseAppConfig & { id: string }>;
}

/**
 * Indexes the projects of `projects.json` by their `id`, the key {@link resolveAppConfig} looks up.
 *
 * @param options - See {@link BuildReleaseConfigOptions}.
 * @returns The release config of every project, keyed by project id.
 */
export function buildReleaseConfig(options: BuildReleaseConfigOptions) {
  return Object.fromEntries(
    options.projects.map(({ id, dokploy, phase }) => [id, { dokploy, phase }]),
  ) as Record<string, ReleaseAppConfig>;
}
