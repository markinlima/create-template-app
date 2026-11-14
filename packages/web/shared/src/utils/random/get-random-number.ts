/**
 * Picks a random integer from 0 up to, and not including, a limit.
 *
 * @param limit - The upper bound, not included.
 * @example
 * getRandomNumber(10); // 0 to 9
 */
export function getRandomNumber(limit: number): number {
  return Math.floor(Math.random() * limit);
}
