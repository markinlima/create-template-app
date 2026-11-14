/** A workspace of the monorepo, as read from its package.json. */
export interface Workspace {
  name: string;
  path: string;
  scripts: Record<string, string>;
}
