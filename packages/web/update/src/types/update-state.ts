import type { UpdateFileData } from "../schemas/update-file-schema";

export interface UpdateState<TData extends UpdateFileData = UpdateFileData> {
  /** A build other than the one running was published (or a chunk of this one is gone). */
  hasNewUpdate: boolean;
  /** The content of the file as published at the last successful check, `null` before it. */
  data: TData | null;
}
