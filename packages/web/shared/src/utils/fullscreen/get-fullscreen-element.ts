import type { VendorDocument } from "../../types/fullscreen";

/**
 * Gets the element that is in fullscreen, in any browser.
 *
 * @returns The element, or `null` when nothing is in fullscreen.
 */
export function getFullscreenElement(): Element | null {
  const doc = document as VendorDocument;

  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}
