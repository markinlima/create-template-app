import { DrawerClose } from "./drawer-close";
import { DrawerContent } from "./drawer-content";
import { DrawerDescription } from "./drawer-description";
import { DrawerFooter } from "./drawer-footer";
import { DrawerHeader } from "./drawer-header";
import { DrawerOverlay } from "./drawer-overlay";
import { DrawerPortal } from "./drawer-portal";
import { DrawerRoot } from "./drawer-root";
import { DrawerTitle } from "./drawer-title";
import { DrawerTrigger } from "./drawer-trigger";

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
