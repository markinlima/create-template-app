import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog";
import { cn } from "tailwind-variants";

export function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-medium text-base text-foreground", className)}
      {...props}
    />
  );
}
