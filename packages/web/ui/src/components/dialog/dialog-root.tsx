import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

export function DialogRoot({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
