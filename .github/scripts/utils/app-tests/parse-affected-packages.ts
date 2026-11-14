import type { AffectedTasksJson } from "../../types/affected-tasks";

/**
 * Returns the unique, sorted names of the packages in the answer of `turbo query affected`.
 *
 * @param json - The parsed answer.
 */
export function parseAffectedPackages(json: AffectedTasksJson) {
  const names = (json.data?.affectedTasks?.items ?? [])
    .map((item) => item.package?.name)
    .filter((name): name is string => !!name);
  return [...new Set(names)].sort();
}
