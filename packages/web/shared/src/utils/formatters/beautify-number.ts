/**
 * Formats a number in the compact form of social networks.
 *
 * @param number - The number to format.
 * @returns The compact number, e.g. `"1.2K"`.
 * @example
 * beautifyNumber(1234); // "1.2K"
 */
export function beautifyNumber(number: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}
