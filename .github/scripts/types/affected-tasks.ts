/** The part of the `turbo query affected --tasks` output that the CI reads. */
export interface AffectedTasksJson {
  data?: {
    affectedTasks?: { items?: { package?: { name?: string } }[] };
  };
}
