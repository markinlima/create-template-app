import { PanelLeftIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Button } from "../../button";
import { useSidebar } from "../hooks/use-sidebar";

/** A button that toggles its {@link Sidebar}. */
export function SidebarTrigger({
  className,
  onClick,
  ...props
}: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="cn-rtl-flip" />
      <span className="sr-only">Alternar barra lateral</span>
    </Button>
  );
}
