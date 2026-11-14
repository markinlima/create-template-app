import { createContext } from "react";

import type { SidebarContextProps } from "../types/sidebar-context-props";

/** The context of a {@link SidebarProvider}. It is `null` outside of one. */
export const SidebarContext = createContext<SidebarContextProps | null>(null);
