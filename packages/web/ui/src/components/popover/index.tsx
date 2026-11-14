import { PopoverContent } from "./components/popover-content";
import { PopoverDescription } from "./components/popover-description";
import { PopoverHeader } from "./components/popover-header";
import { PopoverRoot } from "./components/popover-root";
import { PopoverTitle } from "./components/popover-title";
import { PopoverTrigger } from "./components/popover-trigger";

/** A popup that opens next to its trigger. Use `Popover.trigger`, `Popover.content` and the other parts. */
export const Popover = Object.assign(PopoverRoot, {
  trigger: PopoverTrigger,
  content: PopoverContent,
  header: PopoverHeader,
  title: PopoverTitle,
  description: PopoverDescription,
});
