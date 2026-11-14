import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

/** The element that opens its {@link Tooltip}. */
export function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}
