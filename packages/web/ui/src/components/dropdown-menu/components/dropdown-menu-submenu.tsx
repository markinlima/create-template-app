import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** A submenu of a {@link DropdownMenu}. */
export function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}
