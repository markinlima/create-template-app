import {
  type ComponentProps,
  type CSSProperties,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "tailwind-variants";

import { useIsMobile } from "@web/shared/hooks";

import { SidebarContext } from "../context/sidebar-context";
import type { SidebarContextProps } from "../types/sidebar-context-props";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

const SIDEBAR_COOKIE_EXPIRE = Date.now() + 60 * 60 * 24 * 7;

const SIDEBAR_WIDTH = "16rem";

const SIDEBAR_WIDTH_ICON = "4rem";

/** The root of a {@link Sidebar}: it holds the open state, saves it in a cookie, and shares it with its parts. */
export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { isMobileLayout } = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      cookieStore.set({
        name: SIDEBAR_COOKIE_NAME,
        value: openState.toString(),
        path: "/",
        expires: SIDEBAR_COOKIE_EXPIRE,
      });
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobileLayout
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open);
  }, [isMobileLayout, setOpen]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile: isMobileLayout,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobileLayout, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
