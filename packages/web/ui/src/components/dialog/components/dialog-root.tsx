import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

/**
 * The root of a dialog. It does not close itself when the page changes: a controlled dialog (`open` and `onOpenChange`) is closed by the
 * app, on navigation, when the app needs it.
 */
export function DialogRoot(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
