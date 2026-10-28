import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

export function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="sheet-portal" {...props} />;
}
