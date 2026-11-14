import { Button, type ButtonProps } from "@web/ui/button";

import { useAlertQueue } from "../../hooks/queue/use-alert-queue";

/** Props of `AlertCenter.backButton`: those of a `Button`. */
export type AlertBackButtonProps = ButtonProps;

/**
 * The button that goes back to the previous alert; nothing is drawn at the first one. It takes every prop of a `Button`.
 * `onClick` runs first; call `event.preventDefault()` in it to cancel going back. Needs the alert dialog.
 */
export function AlertBackButton({
  onClick,
  children,
  ...props
}: AlertBackButtonProps) {
  const { isFirst, back } = useAlertQueue();

  if (isFirst) {
    return null;
  }

  return (
    <Button
      variant="outline"
      raised
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          back();
        }
      }}
    >
      {children ?? "Voltar"}
    </Button>
  );
}
