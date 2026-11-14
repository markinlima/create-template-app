import type { z } from "zod";

import type { UpdateFileData } from "../schemas/update-file-schema";
import type { FetchUpdateFileOptions } from "../types/fetch-update-file-options";

/**
 * The data of the file that is published now, or `null` when it can't be known (offline, the file is missing, the answer is not what was
 * expected). A failure never means "there is an update". The request skips every cache, the browser's and the service worker's.
 *
 * @param options - See {@link FetchUpdateFileOptions}.
 * @returns The parsed file, or `null` when it can't be known.
 */
export async function fetchUpdateFile<
  TSchema extends z.ZodType<UpdateFileData>,
>({
  url,
  schema,
  fetcher = fetch,
}: FetchUpdateFileOptions<TSchema>): Promise<z.infer<TSchema> | null> {
  try {
    const response = await fetcher(url, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    const parsed = schema.safeParse(await response.json());

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
