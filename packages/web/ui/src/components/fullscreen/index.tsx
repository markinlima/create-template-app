import { FullscreenCloseButton } from "./fullscreen-close-button";
import { FullscreenContent } from "./fullscreen-content";
import { FullscreenOverlay } from "./fullscreen-overlay";
import { FullscreenPortal } from "./fullscreen-portal";
import { FullscreenProvider } from "./fullscreen-root";
import { SimpleFullscreen } from "./fullscreen-simple";

export const Fullscreen = Object.assign(FullscreenProvider, {
  portal: FullscreenPortal,
  overlay: FullscreenOverlay,
  content: FullscreenContent,
  simple: SimpleFullscreen,
  closeButton: FullscreenCloseButton,
});

export { FullscreenContext, useFullscreenContext } from "./fullscreen-shared";
