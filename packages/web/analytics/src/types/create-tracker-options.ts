/** Options of {@link createTracker}. */
export interface CreateTrackerOptions {
  /**
   * Whether events are sent at all (the Umami envs are set and the visitor allows it). When it is not, `track` does nothing and no event
   * waits for a script that will never come. A function is asked on every event, so a visitor's choice made at runtime counts at once.
   * @defaultValue true
   */
  enabled?: boolean | (() => boolean);
  /**
   * Logs every event with `console.debug`, for local checks. A function is asked on every event, so it can be switched at runtime.
   * @defaultValue false
   */
  debug?: boolean | (() => boolean);
}
