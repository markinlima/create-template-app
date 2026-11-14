/**
 * Opening and closing of the fullscreen content. Opening uses `starting:` (the native `@starting-style`), because the fullscreen is
 * mounted by the app and not by Base UI. Closing sets `data-ending-style` while the fullscreen is leaving.
 */
export const FULLSCREEN_CONTENT_MOTION = [
  "transition-[opacity,scale] duration-200 ease-out",
  "starting:scale-95 starting:opacity-0",
  "data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in",
].join(" ");

/** Opening and closing of the dark layer behind the fullscreen content, same signals as {@link FULLSCREEN_CONTENT_MOTION}. */
export const FULLSCREEN_OVERLAY_MOTION = [
  "transition-opacity duration-200 ease-out",
  "starting:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-in",
].join(" ");
