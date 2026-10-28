import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 overflow-hidden p-2", className)}
      {...props}
    />
  );
}
