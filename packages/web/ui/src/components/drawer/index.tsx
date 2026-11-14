import { DrawerClose } from "./components/drawer-close";
import { DrawerContent } from "./components/drawer-content";
import { DrawerDescription } from "./components/drawer-description";
import { DrawerFooter } from "./components/drawer-footer";
import { DrawerHeader } from "./components/drawer-header";
import { DrawerOverlay } from "./components/drawer-overlay";
import { DrawerPortal } from "./components/drawer-portal";
import { DrawerRoot } from "./components/drawer-root";
import { DrawerTitle } from "./components/drawer-title";
import { DrawerTrigger } from "./components/drawer-trigger";

/** A panel that slides in from an edge of the screen. Use `Drawer.trigger`, `Drawer.content` and the other parts. */
export const Drawer = Object.assign(DrawerRoot, {
  trigger: DrawerTrigger,
  close: DrawerClose,
  portal: DrawerPortal,
  overlay: DrawerOverlay,
  content: DrawerContent,
  header: DrawerHeader,
  footer: DrawerFooter,
  title: DrawerTitle,
  description: DrawerDescription,
});
