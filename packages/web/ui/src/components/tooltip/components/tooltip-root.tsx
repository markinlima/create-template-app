import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

/** The root of a {@link Tooltip}. */
export function TooltipRoot({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}
