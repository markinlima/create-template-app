import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** One item of a sidebar menu. */
export function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}
