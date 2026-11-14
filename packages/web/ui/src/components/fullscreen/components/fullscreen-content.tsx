import { type ComponentProps, useRef } from "react";
import { cn } from "tailwind-variants";

import { FULLSCREEN_CONTENT_MOTION } from "../../../constants/fullscreen-motion";
import { useEscapeKey } from "../hooks/use-escape-key";
import { useFullscreenContext } from "../hooks/use-fullscreen-context";

/** The panel of the fullscreen. Escape closes it wherever the focus is, and it animates with {@link FULLSCREEN_CONTENT_MOTION}. */
export function FullscreenContent({
  className,
  ...props
}: ComponentProps<"div">) {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const { fullscreenState, isTransitioning, handleChangeFullscreenState } =
    useFullscreenContext();

  // NOTE: Escape reaches whatever else listens to it (a dialog inside), so it is not stopped here.
  useEscapeKey(() => handleChangeFullscreenState(false));

  return (
    <div
      role="dialog"
      tabIndex={-1}
      ref={fullscreenRef}
      data-slot="dialog-content"
      data-state={fullscreenState}
      data-ending-style={isTransitioning === "closing" ? "" : undefined}
      className={cn(
        "bg-background absolute top-1/2 left-1/2 z-50 flex size-[98%] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-md border shadow-lg",
        FULLSCREEN_CONTENT_MOTION,
        className,
      )}
      {...props}
    />
  );
}
