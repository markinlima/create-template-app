import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

import { Button } from "../../button";

/** The footer of a {@link Dialog}, where its buttons go. */
export function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        // ? gap-4 and not gap-2: a raised button casts a 6px shadow below it, so stacked buttons would show only 2px between them.
        "bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-4 rounded-b-xl border-t p-4 sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {!!showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline">Fechar</Button>}
        />
      )}
    </div>
  );
}
