import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

/** Shares the delay of the tooltips below it. */
export function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}
