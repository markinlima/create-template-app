import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

/** The root of a {@link Popover}. */
export function PopoverRoot({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}
