/** The value the sidebar shares with its parts: its state, the open flags and the toggles. */
export interface SidebarContextProps {
  /** Whether the desktop sidebar is open or collapsed to its icons. */
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Whether the sidebar is open on a mobile screen. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}
