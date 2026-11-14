import { breakpoints } from "../../constants/breakpoints";
import type { CurrentBreakpoint } from "../../types/current-breakpoint";
import { detectMobileDevice } from "./detect-mobile-device";

/**
 * Reads the device and the width of the window now.
 *
 * @returns See `CurrentBreakpoint`.
 */
export function getCurrentBreakpoint(): CurrentBreakpoint {
  return {
    isMobileDevice: detectMobileDevice(),
    isMobileLayout: window.innerWidth <= breakpoints.lg,
  };
}
