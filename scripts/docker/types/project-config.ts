/** A project of `projects.json` at the root of the repo: an app, or a worker. */
export interface ProjectConfig {
  /** The name of the project: its Compose profile, the prefix of its test profile and of its test network. */
  id: string;
  /** The name shown in the menus. */
  name: string;
  /** The hint shown next to the name in the menus. */
  description: string;
  /** The folder of the project, relative to the root of the repo, e.g. `apps/backend` or `workers/mailer`. */
  path: string;
}
