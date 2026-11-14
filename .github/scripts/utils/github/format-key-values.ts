/**
 * Formats values in the `key=value` format GitHub expects in its output files.
 * A multi-line value is wrapped in a heredoc, with a random delimiter.
 *
 * @param values - Values to format, by key.
 * @returns The text to append to the output file.
 */
export function formatKeyValues(values: Record<string, string>) {
  return Object.entries(values)
    .map(([key, value]) => {
      if (!value.includes("\n")) {
        return `${key}=${value}\n`;
      }
      const delimiter = `EOF_${crypto.randomUUID()}`;
      return `${key}<<${delimiter}\n${value}\n${delimiter}\n`;
    })
    .join("");
}
