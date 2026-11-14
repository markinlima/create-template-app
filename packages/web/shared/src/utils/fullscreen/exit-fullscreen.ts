import type { VendorDocument } from "../../types/fullscreen";

/** Leaves fullscreen, in any browser. */
export function exitFullscreen() {
  const doc = document as VendorDocument;

  if (doc.exitFullscreen) {
    return doc.exitFullscreen();
  }
  if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  }
  if (doc.mozCancelFullScreen) {
    return doc.mozCancelFullScreen();
  }
  if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }
}
