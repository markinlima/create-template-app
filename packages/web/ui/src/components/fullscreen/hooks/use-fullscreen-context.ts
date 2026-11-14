import { use } from "react";

import { FullscreenContext } from "../context/fullscreen-context";

/** Reads the state of a {@link Fullscreen}. It throws outside of one. */
export function useFullscreenContext() {
  const context = use(FullscreenContext);
  if (!context) {
    throw new Error(
      "useFullscreenContext must be used within a FullscreenProvider",
    );
  }
  return context;
}
