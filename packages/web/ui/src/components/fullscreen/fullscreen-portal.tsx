import { createPortal } from "react-dom";

import {
  type FullscreenPortalProps,
  useFullscreenContext,
} from "./fullscreen-shared";

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
