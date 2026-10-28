import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "tailwind-variants";

export function DropdownMenuGroupLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-1.5 py-1 font-medium text-muted-foreground text-xs data-inset:pl-7",
        className,
      )}
      {...props}
    />
  );
}
