/** The options of the {@link updateChecker} Vite plugin. */
export interface UpdateCheckerPluginOptions {
  /** The file written into the build. @defaultValue "version.json" */
  fileName?: string;
  /** The id of the build. @defaultValue The time the build started, see `createBuildId`. */
  buildId?: string;
  /** What goes in the file besides `buildId`, which is always there (a version number, release notes, a flag...). */
  content?: (context: { buildId: string }) => Record<string, unknown>;
}
