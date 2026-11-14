import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** Renders the popup of a {@link DropdownMenu} in the document body. */
export function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}
