import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { useFullscreenContext } from "./fullscreen-shared";

interface FullscreenOverlayProps extends ComponentProps<"button"> {
  onInteractOverlay?: () => void;
  className?: string;
}

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
      onClick={handleOverlayClick}
      className={cn(
        "motion-preset-fade motion-opacity-in-0 data-[state=open]:motion-opacity-in-0 data-[state=closing]:motion-opacity-out-0 motion-duration-200 size-full bg-black/50",
        className,
        {
          "motion-opacity-out-0": isTransitioning === "closing",
        },
      )}
      {...props}
    />
  );
}
