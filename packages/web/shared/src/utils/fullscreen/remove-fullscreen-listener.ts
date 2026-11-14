/**
 * Stops listening to the fullscreen changes.
 *
 * @param callback - The one given to `addFullscreenListener`.
 */
export function removeFullscreenListener(callback: () => void) {
  document.removeEventListener("fullscreenchange", callback);
  document.removeEventListener("webkitfullscreenchange", callback);
  document.removeEventListener("mozfullscreenchange", callback);
  document.removeEventListener("MSFullscreenChange", callback);
}
