import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "tailwind-variants";

/** The text of the selected option, shown in the trigger of a {@link Select}. */
export function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}
