import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

export function DrawerRoot({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="sheet" {...props} />;
}
