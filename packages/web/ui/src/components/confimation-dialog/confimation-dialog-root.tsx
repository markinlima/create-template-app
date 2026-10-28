import type { DialogPortalProps } from "@base-ui/react";
import type { ReactNode } from "react";
import { cn } from "tailwind-variants";

import { Button } from "../button";
import { Dialog } from "../dialog";

interface ConfimationDialogProps {
  children: ReactNode;
  onClickConfirm?: () => void;
  onClickCancel?: () => void;
  confirmButtonVariant?: "primary" | "destructive";
  confirmButtonLabel?: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portalContainer?: DialogPortalProps["container"];
}
/** @deprecated */
export function ConfimationDialogRoot({
  children,
  confirmButtonVariant = "primary",
  confirmButtonLabel = "Confirmar",
  portalContainer,
  className,
  onClickCancel,
  onClickConfirm,
  onOpenChange,
  open,
}: ConfimationDialogProps) {
  function handleCancelClick() {
    onClickCancel?.();
  }

  function handleConfirmClick() {
    onClickConfirm?.();
  }

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal
    >
      <Dialog.content
        hideCloseButton
        portalContainer={portalContainer}
        className={cn("max-w-xl", className)}
      >
        {children}
        <Dialog.footer>
          <Dialog.close
            render={
              <Button raised onClick={handleCancelClick} variant="outline">
                Cancelar
              </Button>
            }
          />
          <Dialog.close>
            <Button
              raised
              variant={confirmButtonVariant}
              onClick={handleConfirmClick}
            >
              {confirmButtonLabel}
            </Button>
          </Dialog.close>
        </Dialog.footer>
      </Dialog.content>
    </Dialog>
  );
}
