/**
 * Waits some time.
 *
 * @param ms - Time to wait, in milliseconds.
 * @example
 * await sleep(500);
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
