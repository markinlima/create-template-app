import type { VendorElement } from "../../types/fullscreen";

/**
 * Takes an element to fullscreen, in any browser.
 *
 * @param element - The element to show in fullscreen.
 */
export function requestFullscreen(element: HTMLElement) {
  const el = element as VendorElement;

  if (el.requestFullscreen) {
    return el.requestFullscreen();
  }
  if (el.webkitRequestFullscreen) {
    return el.webkitRequestFullscreen();
  }
  if (el.mozRequestFullScreen) {
    return el.mozRequestFullScreen();
  }
  if (el.msRequestFullscreen) {
    return el.msRequestFullscreen();
  }
}
