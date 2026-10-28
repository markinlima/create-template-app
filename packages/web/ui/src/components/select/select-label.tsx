import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}
