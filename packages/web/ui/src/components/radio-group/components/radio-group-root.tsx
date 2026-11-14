import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "tailwind-variants";

/** The root of a {@link RadioGroup}. */
export function RadioGroupRoot({
  className,
  ...props
}: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  );
}
