/** The browser events the checker listens to: each one calls the callback and returns what stops listening. */
export interface UpdateEvents {
  /** Calls `callback` each time the tab comes back to the front; returns what stops it. */
  onTabVisible: (callback: () => void) => () => void;
  /** Calls `callback` each time Vite can't load the file of a lazy chunk; returns what stops it. */
  onPreloadError: (callback: () => void) => () => void;
}
