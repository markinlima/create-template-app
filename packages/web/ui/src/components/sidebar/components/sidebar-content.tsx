import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** The scrollable area of a {@link Sidebar} that holds its groups. */
export function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}
