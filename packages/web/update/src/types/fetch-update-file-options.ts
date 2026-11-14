import type { z } from "zod";

import type { UpdateFileData } from "../schemas/update-file-schema";

/** The options of {@link fetchUpdateFile}. */
export interface FetchUpdateFileOptions<
  TSchema extends z.ZodType<UpdateFileData>,
> {
  /** The address of the file, from the root of the site. */
  url: string;
  /** The shape the file must have; a file that does not match is `null`. */
  schema: TSchema;
  /** The `fetch` that asks for the file. @defaultValue the global `fetch` */
  fetcher?: typeof fetch;
}
