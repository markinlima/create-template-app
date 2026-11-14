import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** The button that opens its {@link DropdownMenu}. */
export function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}
