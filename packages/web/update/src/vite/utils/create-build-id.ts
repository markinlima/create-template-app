/**
 * The id of a build: the moment the build started. Every build gets a new one, so every build is told to the tabs that run an older one.
 *
 * @param now - The time in milliseconds since the epoch.
 * @returns The id, as a string of digits.
 * @defaultValue `Date.now()`
 */
export function createBuildId(now = Date.now()) {
  return String(now);
}
