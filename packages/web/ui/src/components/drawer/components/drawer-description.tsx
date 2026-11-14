import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

/** The text under the title of a {@link Drawer}. */
export function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}
