import { FullscreenCloseButton } from "./components/fullscreen-close-button";
import { FullscreenContent } from "./components/fullscreen-content";
import { FullscreenOverlay } from "./components/fullscreen-overlay";
import { FullscreenPortal } from "./components/fullscreen-portal";
import { FullscreenProvider } from "./components/fullscreen-root";
import { SimpleFullscreen } from "./components/fullscreen-simple";

/** A panel that covers the screen, with its own open state. See its parts in the index. */
export const Fullscreen = Object.assign(FullscreenProvider, {
  portal: FullscreenPortal,
  overlay: FullscreenOverlay,
  content: FullscreenContent,
  simple: SimpleFullscreen,
  closeButton: FullscreenCloseButton,
});

export { FullscreenContext } from "./context/fullscreen-context";
export { useFullscreenContext } from "./hooks/use-fullscreen-context";
