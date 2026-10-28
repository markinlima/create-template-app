import { type ComponentProps, useRef } from "react";
import { cn } from "tailwind-variants";

import { useKeypress } from "@web/shared/hooks/use-key-press";

import { useFullscreenContext } from "./fullscreen-shared";

export function FullscreenContent({
  className,
  ...props
}: ComponentProps<"div">) {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const { fullscreenState, isTransitioning, handleChangeFullscreenState } =
    useFullscreenContext();

  useKeypress({
    combo: ["escape"],
    callback: () => {
      handleChangeFullscreenState(false);
    },
    target: fullscreenRef.current,
  });

  return (
    <div
      role="dialog"
      tabIndex={-1}
      ref={fullscreenRef}
      data-slot="dialog-content"
      data-state={fullscreenState}
      className={cn(
        "motion-duration-200 motion-opacity-in-0 motion-scale-in-95 absolute top-1/2 left-1/2 z-50 flex size-[98%] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-md border bg-background shadow-lg",
        className,
        {
          "motion-opacity-out-0 motion-scale-out-95":
            isTransitioning === "closing",
        },
      )}
      {...props}
    />
  );
}
