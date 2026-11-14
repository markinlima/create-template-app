/**
 * Escape the characters of a string that a regular expression treats as syntax.
 *
 * @param value - The text to match literally.
 * @returns The text safe to put inside a `RegExp`.
 */
export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
