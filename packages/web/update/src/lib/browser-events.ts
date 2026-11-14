import type { UpdateEvents } from "../types/update-events";

/** The events of the browser the checker listens to. The checker starts them from an effect, so they only run in the browser. */
export const browserEvents: UpdateEvents = {
  onTabVisible(callback) {
    function handle() {
      if (document.visibilityState === "visible") {
        callback();
      }
    }

    document.addEventListener("visibilitychange", handle);

    return () => document.removeEventListener("visibilitychange", handle);
  },
  onPreloadError(callback) {
    // NOTE: Vite fires it on `window`.
    window.addEventListener("vite:preloadError", callback);

    return () => window.removeEventListener("vite:preloadError", callback);
  },
};
