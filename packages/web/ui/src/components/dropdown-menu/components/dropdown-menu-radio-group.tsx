import { Menu as MenuPrimitive } from "@base-ui/react/menu";

/** A group of radio items in a {@link DropdownMenu}: one is selected at a time. */
export function DropdownMenuRadioGroup({
  ...props
}: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}
