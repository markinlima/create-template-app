import { cn } from "tailwind-variants";

import { DropdownMenuContent } from "./dropdown-menu-content";

/** The popup of a submenu of a {@link DropdownMenu}. */
export function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground ring-foreground/10 w-auto min-w-24 rounded-md p-1 shadow-lg ring-1",
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}
