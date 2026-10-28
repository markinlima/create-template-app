import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

export function PopoverRoot({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}
