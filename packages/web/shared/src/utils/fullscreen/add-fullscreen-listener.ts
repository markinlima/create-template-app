/**
 * Listens to the fullscreen changes, in any browser.
 *
 * @param callback - Called when something enters or leaves fullscreen.
 */
export function addFullscreenListener(callback: () => void) {
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  document.addEventListener("mozfullscreenchange", callback);
  document.addEventListener("MSFullscreenChange", callback);
}
