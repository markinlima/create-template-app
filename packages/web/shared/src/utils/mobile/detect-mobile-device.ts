/**
 * Tells whether the device is a phone or a tablet, from the user agent and the touch support.
 *
 * @returns `true` when the device is probably a phone or a tablet.
 */
export function detectMobileDevice(): boolean {
  const userAgentCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent,
  );
  const touchCheck = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return userAgentCheck || touchCheck;
}
