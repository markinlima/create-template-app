/** A value of an event payload. */
export type UmamiEventValue = string | number | boolean;

/** Flat payload of a custom event. Never put free text or personal data here. */
export type UmamiEventData = Record<string, UmamiEventValue>;

/** The part of the Umami tracker (`window.umami`) this lib uses. */
export interface UmamiTracker {
  /** Sends a custom event. */
  track: (eventName: string, data?: UmamiEventData) => void;
  /** Ties the session of the visitor to an id of your own (`umami.identify`). */
  identify?: (uniqueId: string, data?: UmamiEventData) => void;
}

declare global {
  interface Window {
    /** Set by the Umami tracker script once it has loaded. */
    umami?: UmamiTracker;
  }
}
