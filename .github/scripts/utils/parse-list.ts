/** Splits a comma- or whitespace-separated input ("unit, e2e") into its non-empty items. */
export function parseList(input: string) {
  return input
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
