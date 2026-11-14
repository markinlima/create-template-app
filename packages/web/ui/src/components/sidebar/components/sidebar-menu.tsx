import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** A list of menu items of a {@link Sidebar}. */
export function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-0", className)}
      {...props}
    />
  );
}
