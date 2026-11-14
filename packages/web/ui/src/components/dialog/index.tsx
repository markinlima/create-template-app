import { DialogClose } from "./components/dialog-close";
import { DialogContent } from "./components/dialog-content";
import { DialogDescription } from "./components/dialog-description";
import { DialogFooter } from "./components/dialog-footer";
import { DialogHeader } from "./components/dialog-header";
import { DialogOverlay } from "./components/dialog-overlay";
import { DialogPortal } from "./components/dialog-portal";
import { DialogPresets } from "./components/dialog-presets";
import { DialogRoot } from "./components/dialog-root";
import { DialogScrollArea } from "./components/dialog-scroll-area";
import { DialogTitle } from "./components/dialog-title";
import { DialogTrigger } from "./components/dialog-trigger";

/** A modal dialog. Use `Dialog.trigger`, `Dialog.content`, `Dialog.title` and the other parts. */
export const Dialog = Object.assign(DialogRoot, {
  trigger: DialogTrigger,
  portal: DialogPortal,
  overlay: DialogOverlay,
  content: DialogContent,
  header: DialogHeader,
  footer: DialogFooter,
  scrollArea: DialogScrollArea,
  title: DialogTitle,
  description: DialogDescription,
  close: DialogClose,
  presets: DialogPresets,
});
