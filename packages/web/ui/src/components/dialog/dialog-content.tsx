import {
  type DialogPopupProps,
  type DialogPortalProps,
  Dialog as DialogPrimitive,
} from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "../button";
import { DialogOverlay } from "./dialog-overlay";
import { DialogPortal } from "./dialog-portal";

interface DialogContentProps extends DialogPopupProps {
  hideCloseButton?: boolean;
  portalContainer?: DialogPortalProps["container"];
}

export function DialogContent({
  className,
  children,
  hideCloseButton = false,
  portalContainer,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal container={portalContainer}>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 scale-100 flex-col gap-4 rounded-xl bg-card p-4 text-sm outline-none ring-1 ring-foreground/10 duration-100",
          // ? styles when is a nested dialog
          // ? add a after pseudo-element to the dialog content when a nested dialog is open with a blurred effect
          "data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:z-10 data-nested-dialog-open:after:block data-nested-dialog-open:after:bg-black/10 data-nested-dialog-open:after:backdrop-blur-sm",
          // ? animation starting
          "data-starting-style:scale-96",
          // ? animation ending
          "data-ending-style:scale-96 data-ending-style:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
