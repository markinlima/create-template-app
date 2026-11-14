import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

/** The title of a {@link Drawer}. It names it for screen readers. */
export function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-base font-medium", className)}
      {...props}
    />
  );
}
