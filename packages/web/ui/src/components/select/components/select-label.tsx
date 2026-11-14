import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

/** The label of a group of options of a {@link Select}. */
export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  );
}
