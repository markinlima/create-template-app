import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "flex items-center gap-2 font-bold text-base leading-none",
        className,
      )}
      {...props}
    />
  );
}
