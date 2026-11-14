export type ReleaseConfig = Record<string, unknown>;

/**
 * Turns the root `projects.json` (a `projects` list, each project with its `id` and its release ids) into the config keyed by project id.
 */
export function readReleaseConfig(raw: unknown): ReleaseConfig {
  const projects = (raw as { projects?: Array<{ id: string }> }).projects ?? [];

  return Object.fromEntries(projects.map((project) => [project.id, project]));
}

function hasPlaceholder(value: unknown): boolean {
  if (typeof value === "string") {
    return value.includes("REPLACE_ME");
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasPlaceholder);
  }

  return false;
}

/** Whether an app can be released: it has an entry in the release config and the entry has no `REPLACE_ME` left (the pipeline rejects the tag otherwise). */
export function validateAppConfig(config: ReleaseConfig, projectId: string) {
  const entry = config[projectId];

  if (!entry) {
    return [`"${projectId}" has no entry in the release config`];
  }

  return hasPlaceholder(entry)
    ? [`the entry of "${projectId}" in the release config still has REPLACE_ME`]
    : [];
}
