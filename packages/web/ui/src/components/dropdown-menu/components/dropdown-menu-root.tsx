import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** The root of a {@link DropdownMenu}. */
export function DropdownMenuRoot({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
