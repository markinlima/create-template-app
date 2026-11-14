import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

/** The title of a {@link Dialog}. It names the dialog for screen readers. */
export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "flex items-center gap-2 text-base leading-none font-bold",
        className,
      )}
      {...props}
    />
  );
}
