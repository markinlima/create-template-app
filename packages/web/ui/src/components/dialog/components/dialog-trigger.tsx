import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

/** The button that opens its {@link Dialog}. */
export function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
