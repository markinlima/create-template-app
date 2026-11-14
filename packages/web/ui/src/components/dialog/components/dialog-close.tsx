import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

/** A button that closes its {@link Dialog}. */
export function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
