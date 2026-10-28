import type { ComponentProps } from "react";

import { FullscreenCloseButton } from "./fullscreen-close-button";
import { FullscreenContent } from "./fullscreen-content";
import { FullscreenOverlay } from "./fullscreen-overlay";
import { FullscreenPortal } from "./fullscreen-portal";
import type { FullscreenPortalProps } from "./fullscreen-shared";

interface SimpleFullscreenProps
  extends FullscreenPortalProps,
    ComponentProps<"div"> {
  children: React.ReactNode;
  hideCloseButton?: boolean;
  onInteractOverlay?: () => void;
}

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
