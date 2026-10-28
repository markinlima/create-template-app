import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

export function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="sheet-close" {...props} />;
}
