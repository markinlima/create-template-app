import { dayjs } from "../../lib/dayjs";

/**
 * Counts the days between a moment and now, rounding up.
 *
 * @param timestamp - The moment to compare with now.
 * @returns The number of days, never negative.
 * @example
 * calculateDaysSince(Date.now() - 36 * 60 * 60 * 1000); // 2
 */
export function calculateDaysSince(timestamp: string | number | Date): number {
  return Math.ceil(Math.abs(dayjs(timestamp).diff(new Date(), "days", true)));
}
