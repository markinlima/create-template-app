import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

/** A line between groups of options of a {@link Select}. */
export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}
