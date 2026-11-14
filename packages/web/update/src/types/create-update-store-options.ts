import type { z } from "zod";

import type { UpdateFileData } from "../schemas/update-file-schema";
import type { UpdateCheckerOptions } from "./update-checker-options";
import type { UpdateEvents } from "./update-events";

/** The options of the update store: the checker's options, plus the seams the tests replace. */
export interface CreateUpdateStoreOptions<
  TSchema extends z.ZodType<UpdateFileData>,
> extends UpdateCheckerOptions<TSchema> {
  /** The `fetch` that asks for the file. @defaultValue the global `fetch` */
  fetcher?: typeof fetch;
  /** The browser events that trigger a check. @defaultValue the browser's own events */
  events?: UpdateEvents;
}
