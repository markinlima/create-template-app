import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** A group of related items in a {@link DropdownMenu}. */
export function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}
