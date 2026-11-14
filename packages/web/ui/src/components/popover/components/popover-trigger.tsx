import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

/** The element that opens its {@link Popover}. */
export function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}
