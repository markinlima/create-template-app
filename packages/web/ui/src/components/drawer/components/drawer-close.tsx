import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

/** A button that closes its {@link Drawer}. */
export function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="sheet-close" {...props} />;
}
