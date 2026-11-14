import { TooltipContent } from "./components/tooltip-content";
import { TooltipProvider } from "./components/tooltip-provider";
import { TooltipRoot } from "./components/tooltip-root";
import { TooltipTrigger } from "./components/tooltip-trigger";

/** A short text that opens when the trigger is hovered or focused. Use `Tooltip.trigger`, `Tooltip.content` and the provider. */
export const Tooltip = Object.assign(TooltipRoot, {
  trigger: TooltipTrigger,
  content: TooltipContent,
  provider: TooltipProvider,
});
