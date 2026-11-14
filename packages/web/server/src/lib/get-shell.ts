import { readShell } from "../utils/head-route/read-shell";
import { getPublicFiles } from "./get-public-files";

/** The text of the `index.html` of the build, or `undefined` when the build has none. */
export async function getShell() {
  return readShell(await getPublicFiles());
}
