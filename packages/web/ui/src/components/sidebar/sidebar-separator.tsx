import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Separator } from "../separator";

export function SidebarSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 h-px w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
}
