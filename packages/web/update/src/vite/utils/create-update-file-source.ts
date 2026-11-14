import type { CreateUpdateFileSourceOptions } from "../../types/create-update-file-source-options";
/**
 * The text of the update file: what the app adds, and the build id, which nothing can replace.
 *
 * @param options - See {@link CreateUpdateFileSourceOptions}.
 * @returns The JSON text of the file.
 */
export function createUpdateFileSource({
  buildId,
  content,
}: CreateUpdateFileSourceOptions) {
  return JSON.stringify({ ...content?.({ buildId }), buildId });
}
