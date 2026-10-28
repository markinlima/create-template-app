import { PopoverContent } from "./popover-content";
import { PopoverDescription } from "./popover-description";
import { PopoverHeader } from "./popover-header";
import { PopoverRoot } from "./popover-root";
import { PopoverTitle } from "./popover-title";
import { PopoverTrigger } from "./popover-trigger";

export const Popover = Object.assign(PopoverRoot, {
  trigger: PopoverTrigger,
  content: PopoverContent,
  header: PopoverHeader,
  title: PopoverTitle,
  description: PopoverDescription,
});
