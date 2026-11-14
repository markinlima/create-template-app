import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

/** Renders the parts of a {@link Drawer} in the document body. */
export function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="sheet-portal" {...props} />;
}
