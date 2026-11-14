import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Separator } from "../../separator";

/** A line inside a {@link Sidebar}. */
export function SidebarSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 h-px w-auto", className)}
      {...props}
    />
  );
}
