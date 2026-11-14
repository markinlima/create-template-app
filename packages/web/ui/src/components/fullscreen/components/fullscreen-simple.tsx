import type { ComponentProps } from "react";

import type { FullscreenPortalProps } from "../types/fullscreen-portal-props";
import { FullscreenCloseButton } from "./fullscreen-close-button";
import { FullscreenContent } from "./fullscreen-content";
import { FullscreenOverlay } from "./fullscreen-overlay";
import { FullscreenPortal } from "./fullscreen-portal";

interface SimpleFullscreenProps
  extends FullscreenPortalProps,
    ComponentProps<"div"> {
  children: React.ReactNode;
  hideCloseButton?: boolean;
  onInteractOverlay?: () => void;
}

/** A {@link Fullscreen} with its overlay, content and close button already assembled. */
export function SimpleFullscreen({
  containerElement,
  onInteractOverlay,
  hideCloseButton,
  children,
  ...props
}: SimpleFullscreenProps) {
  return (
    <FullscreenPortal containerElement={containerElement}>
      <FullscreenOverlay onInteractOverlay={onInteractOverlay} />
      <FullscreenContent {...props}>
        {!hideCloseButton && <FullscreenCloseButton />}
        {children}
      </FullscreenContent>
    </FullscreenPortal>
  );
}
