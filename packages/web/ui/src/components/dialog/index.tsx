import { DialogClose } from "./dialog-close";
import { DialogContent } from "./dialog-content";
import { DialogDescription } from "./dialog-description";
import { DialogFooter } from "./dialog-footer";
import { DialogHeader } from "./dialog-header";
import { DialogOverlay } from "./dialog-overlay";
import { DialogPortal } from "./dialog-portal";
import { DialogPresets } from "./dialog-presets";
import { DialogRoot } from "./dialog-root";
import { DialogTitle } from "./dialog-title";
import { DialogTrigger } from "./dialog-trigger";

export const Dialog = Object.assign(DialogRoot, {
  trigger: DialogTrigger,
  portal: DialogPortal,
  overlay: DialogOverlay,
  content: DialogContent,
  header: DialogHeader,
  footer: DialogFooter,
  title: DialogTitle,
  description: DialogDescription,
  close: DialogClose,
  presets: DialogPresets,
});
