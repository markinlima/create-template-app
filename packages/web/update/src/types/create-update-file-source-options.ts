/** The options of {@link createUpdateFileSource}: the build id and the fields the app adds. */
export interface CreateUpdateFileSourceOptions {
  /** The id of the build, always written in the file. */
  buildId: string;
  /** The fields the app adds to the file; they can't replace `buildId`. */
  content?: (context: { buildId: string }) => Record<string, unknown>;
}
