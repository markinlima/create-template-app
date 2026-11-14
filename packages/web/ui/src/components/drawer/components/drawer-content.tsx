import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { DRAWER_MOTION } from "../../../constants/drawer-motion";
import { Button } from "../../button";
import { DrawerOverlay } from "./drawer-overlay";
import { DrawerPortal } from "./drawer-portal";

/** The panel of a {@link Drawer}. It slides in from its edge with {@link DRAWER_MOTION}. */
export function DrawerContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: DrawerPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        data-side={side}
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          DRAWER_MOTION,
          className,
        )}
        {...props}
      >
        {children}
        {!!showCloseButton && (
          <DrawerPrimitive.Close
            data-slot="drawer-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon"
              >
                <XIcon />
                <span className="sr-only">Fechar</span>
              </Button>
            }
          />
        )}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  );
}
