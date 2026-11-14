import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { FULLSCREEN_OVERLAY_MOTION } from "../../../constants/fullscreen-motion";
import { useFullscreenContext } from "../hooks/use-fullscreen-context";

interface FullscreenOverlayProps extends ComponentProps<"button"> {
  onInteractOverlay?: () => void;
  className?: string;
}

/** The dark layer behind the fullscreen. A click on it closes the fullscreen. */
export function FullscreenOverlay({
  className,
  onInteractOverlay,
  ...props
}: FullscreenOverlayProps) {
  const { isOpen, handleChangeFullscreenState, isTransitioning } =
    useFullscreenContext();

  if (!isOpen && !isTransitioning) {
    return null;
  }

  function handleOverlayClick() {
    onInteractOverlay?.();
    handleChangeFullscreenState(false);
  }

  return (
    <button
      data-slot="fullscreen-overlay"
      data-ending-style={isTransitioning === "closing" ? "" : undefined}
      onClick={handleOverlayClick}
      className={cn(
        "size-full bg-black/50",
        FULLSCREEN_OVERLAY_MOTION,
        className,
      )}
      {...props}
    />
  );
}
