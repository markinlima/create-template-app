import type { TrackArguments } from "./track-arguments";
import type { TrackerEvents } from "./tracker-events";

/** What {@link createTracker} gives: a typed `track` and `identify`. */
export interface Tracker<TEvents extends TrackerEvents> {
  /** Sends an event; the name and the payload are typed from the event map. It never throws. */
  track: <TName extends keyof TEvents & string>(
    name: TName,
    ...args: TrackArguments<TEvents[TName]>
  ) => void;
  /**
   * Ties the visitor's session to an internal id of the user (never a name, an e-mail or anything else personal). Only for a visitor who
   * agreed to it: the caller decides, this does not ask. It does nothing while the tracker script has not loaded or when events are off.
   */
  identify: (userId: string) => void;
}
