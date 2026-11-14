import type { DialogPortalProps } from "@base-ui/react";
import { CheckIcon, XIcon } from "lucide-react";
import type { ComponentType, JSX, ReactNode } from "react";
import { cn } from "tailwind-variants";

import { Button, type ButtonVariants } from "../../button";
import { DialogClose } from "../components/dialog-close";
import { DialogContent } from "../components/dialog-content";
import { DialogFooter } from "../components/dialog-footer";
import { DialogRoot } from "../components/dialog-root";
import { DialogTrigger } from "../components/dialog-trigger";

interface ContentDialogProps {
  children: ReactNode;
  portalContainer?: DialogPortalProps["container"];
  className?: string;
}

interface RootDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ConfirmationDialogProps
  extends ContentDialogProps,
    RootDialogProps {
  onClickConfirm?: () => void;
  onClickCancel?: () => void;
  dialogTrigger?: () => JSX.Element;
  confirmButtonVariant?: ButtonVariants["variant"];
  confirmButtonLabel?: string;
  /** The icon of the confirm button: the icon of the action it does (the trash can to delete). @default a check */
  confirmButtonIcon?: ComponentType<{ className?: string }>;
}

/** A dialog that asks to confirm an action, with a confirm and a cancel button. */
export function ConfirmationDialog({
  children,
  confirmButtonVariant = "primary",
  confirmButtonLabel = "Confirmar",
  confirmButtonIcon: ConfirmButtonIcon = CheckIcon,
  portalContainer,
  dialogTrigger,
  className,
  onClickCancel,
  onClickConfirm,
  onOpenChange,
  open,
}: ConfirmationDialogProps) {
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
                <XIcon />
                Cancelar
              </Button>
            }
          />
          {/* ? Through `render`, like the cancel button: a Button as the child of the close would be a button inside a button. */}
          <DialogClose
            render={
              <Button
                raised
                variant={confirmButtonVariant}
                onClick={handleConfirmClick}
              >
                <ConfirmButtonIcon />
                {confirmButtonLabel}
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
