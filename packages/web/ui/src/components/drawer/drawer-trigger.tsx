import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";

export function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}
