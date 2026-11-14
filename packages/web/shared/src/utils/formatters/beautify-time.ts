/** Options of {@link beautifyTime}. */
export interface BeautifyTimeOptions {
  /**
   * Leave the hours out when they are zero.
   * @defaultValue true
   */
  hideHoursIfZero?: boolean;
}

/**
 * Formats a time in seconds as `mm:ss`, or `hh:mm:ss`.
 *
 * @param timeInSeconds - The time, in seconds.
 * @param options - See {@link BeautifyTimeOptions}.
 * @returns The time, e.g. `"01:01"`.
 * @throws When the time is negative.
 * @example
 * beautifyTime(3661); // "01:01:01"
 */
export function beautifyTime(
  timeInSeconds: number,
  { hideHoursIfZero = true }: BeautifyTimeOptions = {},
) {
  if (timeInSeconds < 0) {
    throw new Error(`timeInSeconds must be >= 0, received ${timeInSeconds}`);
  }

  const _seconds = Math.floor(timeInSeconds % 60);
  const _minutes = Math.floor(timeInSeconds / 60) % 60;
  const _hours = Math.floor(timeInSeconds / 3600);

  const seconds = String(_seconds).padStart(2, "0");
  const minutes = String(_minutes).padStart(2, "0");
  const hours = String(_hours).padStart(2, "0");

  if (hideHoursIfZero && _hours === 0) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}
