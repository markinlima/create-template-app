import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** The footer of a {@link Sidebar}. */
export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}
