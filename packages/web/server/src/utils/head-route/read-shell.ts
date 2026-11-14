import type { PublicFile } from "../../types/public-file";

/** The text of the `index.html` of the build (the uncompressed copy), or `undefined` when the build has none. */
export async function readShell(files: Map<string, PublicFile>) {
  const shell = files.get("/index.html");

  if (!shell) {
    return undefined;
  }

  const { body } = shell.raw;

  return body instanceof Blob ? body.text() : new TextDecoder().decode(body);
}
