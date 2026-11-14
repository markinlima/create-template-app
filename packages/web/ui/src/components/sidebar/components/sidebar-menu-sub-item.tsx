import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** One item of a submenu of a {@link Sidebar}. */
export function SidebarMenuSubItem({
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}
