import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

import { BACKDROP_MOTION } from "../../../constants/backdrop-motion";

/** The dark layer behind a {@link Drawer}, animated with {@link BACKDROP_MOTION}. */
export function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        BACKDROP_MOTION,
        className,
      )}
      {...props}
    />
  );
}
