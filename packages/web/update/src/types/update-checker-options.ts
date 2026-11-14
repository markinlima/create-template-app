import type { z } from "zod";

import type { UpdateFileData } from "../schemas/update-file-schema";

export interface UpdateCheckerOptions<
  TSchema extends z.ZodType<UpdateFileData>,
> {
  /** The id of the build this code was made with (the `VITE_BUILD_ID` the Vite plugin defines). */
  currentBuildId: string;
  /** The file the build wrote, asked for at the root of the site. @defaultValue "version.json" */
  fileName?: string;
  /** How often a tab asks, in milliseconds. @defaultValue 300000 (5 minutes) */
  intervalMs?: number;
  /**
   * The shape of the file. Give an extension of `updateFileSchema` when the app adds fields to the file (through the `content` of the Vite
   * plugin), and `useUpdateData` is typed with it. A file that does not match is never an update.
   */
  schema?: TSchema;
  /** Whether a lazy chunk that fails to load (the old build's files are gone) counts as an update. @defaultValue true */
  treatPreloadErrorAsUpdate?: boolean;
}
