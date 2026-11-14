import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

import { BACKDROP_MOTION } from "../../../constants/backdrop-motion";

/** The dark layer behind a {@link Dialog}, animated with {@link BACKDROP_MOTION}. */
export function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        BACKDROP_MOTION,
        className,
      )}
      {...props}
    />
  );
}
