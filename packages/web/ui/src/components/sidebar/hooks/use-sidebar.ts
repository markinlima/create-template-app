import { useContext } from "react";

import { SidebarContext } from "../context/sidebar-context";

/**
 * Reads the sidebar state and toggles. It throws outside of a {@link SidebarProvider}.
 *
 * @returns The sidebar context, see {@link SidebarContextProps}.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}
