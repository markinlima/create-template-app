import { MOBILE_MEDIA_QUERY } from "../constants/mobile-media-query";

/** Whether the viewport is below Tailwind's `sm` breakpoint. */
export function isMobileViewport() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}
