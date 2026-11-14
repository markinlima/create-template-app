import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

/** Renders the parts of a {@link Dialog} in the document body, outside of the page layout. */
export function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
