import type { DialogPortalProps } from "@base-ui/react";
import type { JSX, ReactNode } from "react";
import { cn } from "tailwind-variants";

import { Button, type ButtonVariants } from "../../button";
import { DialogClose } from "../dialog-close";
import { DialogContent } from "../dialog-content";
import { DialogFooter } from "../dialog-footer";
import { DialogRoot } from "../dialog-root";
import { DialogTrigger } from "../dialog-trigger";

interface ContentDialogProps {
  children: ReactNode;
  portalContainer?: DialogPortalProps["container"];
  className?: string;
}

interface RootDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ConfimationDialogProps
  extends ContentDialogProps,
    RootDialogProps {
  onClickConfirm?: () => void;
  onClickCancel?: () => void;
  dialogTrigger?: () => JSX.Element;
  confirmButtonVariant?: ButtonVariants["variant"];
  confirmButtonLabel?: string;
}

export function ConfimationDialog({
  children,
  confirmButtonVariant = "primary",
  confirmButtonLabel = "Confirmar",
  portalContainer,
  dialogTrigger,
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
    <DialogRoot
      modal
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal
    >
      {!!dialogTrigger && <DialogTrigger render={dialogTrigger()} />}
      <DialogContent
        hideCloseButton
        portalContainer={portalContainer}
        className={cn("max-w-xl", className)}
      >
        {children}
        <DialogFooter className="flex-row">
          <DialogClose
            render={
              <Button raised onClick={handleCancelClick} variant="outline">
                Cancelar
              </Button>
            }
          />
          <DialogClose>
            <Button
              raised
              variant={confirmButtonVariant}
              onClick={handleConfirmClick}
            >
              {confirmButtonLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
