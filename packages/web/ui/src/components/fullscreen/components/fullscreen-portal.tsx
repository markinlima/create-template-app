import { createPortal } from "react-dom";

import { useFullscreenContext } from "../hooks/use-fullscreen-context";
import type { FullscreenPortalProps } from "../types/fullscreen-portal-props";

/** Renders the parts of a {@link Fullscreen} in a portal. */
export function FullscreenPortal({
  children,
  containerElement,
}: FullscreenPortalProps) {
  const { isOpen, isTransitioning } = useFullscreenContext();
  if (!isOpen && !isTransitioning) {
    return null;
  }

  return createPortal(
    <div className="fixed top-0 left-0 z-50 flex size-full items-center justify-center">
      {children}
    </div>,
    containerElement ?? document.body,
  );
}
