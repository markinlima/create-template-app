import {
  type DialogPopupProps,
  type DialogPortalProps,
  Dialog as DialogPrimitive,
} from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { DIALOG_MOTION } from "../../../constants/dialog-motion";
import { Button } from "../../button";
import { DialogOverlay } from "./dialog-overlay";
import { DialogPortal } from "./dialog-portal";

interface DialogContentProps extends DialogPopupProps {
  hideCloseButton?: boolean;
  portalContainer?: DialogPortalProps["container"];
}

/** The panel of a {@link Dialog}, rendered in its portal with the animation of {@link DIALOG_MOTION}. */
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
          "bg-card ring-foreground/10 fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-xl p-4 text-sm ring-1 outline-none",
          DIALOG_MOTION,
          // ? The height limit follows the container the dialog is rendered in: the screen for the body, but the box that holds it (a post)
          // ? otherwise. A `dvh` limit squeezed a dialog inside a post on short screens, even when the post was taller than the screen.
          portalContainer
            ? "max-h-[calc(100%-2rem)]"
            : "max-h-[calc(100dvh-2rem)]",
          // ? styles when is a nested dialog
          // ? add a after pseudo-element to the dialog content when a nested dialog is open with a blurred effect
          "data-nested-dialog-open:after:fixed data-nested-dialog-open:after:inset-0 data-nested-dialog-open:after:z-10 data-nested-dialog-open:after:block data-nested-dialog-open:after:bg-black/10 data-nested-dialog-open:after:backdrop-blur-sm",
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
                className="absolute top-2 right-2 z-20"
                size="icon"
              >
                <XIcon />
                <span className="sr-only">Fechar</span>
              </Button>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
