import { dayjs } from "../../lib/dayjs";

/**
 * Tells how long ago a moment was, in Portuguese (the text is shown to the user).
 *
 * @param timestamp - The moment to compare with now.
 * @returns The relative time, e.g. `"há 2 horas"`, or `"agora mesmo"` for a moment in the future.
 * @example
 * formatTimeAgo(Date.now() - 2 * 60 * 60 * 1000); // "há 2 horas"
 */
export function formatTimeAgo(timestamp: string | number | Date): string {
  const pastDate = dayjs(timestamp);
  const currentDate = dayjs();

  if (pastDate.isAfter(currentDate)) {
    return "agora mesmo";
  }

  return pastDate.fromNow();
}
