import { appendFileSync } from "node:fs";

import { formatKeyValues } from "./format-key-values";

/**
 * Appends values to the file that GitHub names in an environment variable (`GITHUB_OUTPUT`, `GITHUB_ENV`).
 * Outside GitHub Actions, where that variable is missing, the values are printed instead.
 *
 * @param fileEnv - Name of the environment variable that holds the file path.
 * @param values - Values to append, by key.
 */
export function appendGithubFile(
  fileEnv: string,
  values: Record<string, string>,
) {
  const file = process.env[fileEnv];
  const content = formatKeyValues(values);
  if (file) {
    appendFileSync(file, content);
  } else {
    // NOTE: outside GitHub Actions (e.g. running a script by hand) the values are only printed.
    console.log(`[${fileEnv}]\n${content}`);
  }
}
