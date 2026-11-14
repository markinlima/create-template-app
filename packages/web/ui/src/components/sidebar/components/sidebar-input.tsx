import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Input } from "../../input";

/** A search field inside a {@link Sidebar}. */
export function SidebarInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}
