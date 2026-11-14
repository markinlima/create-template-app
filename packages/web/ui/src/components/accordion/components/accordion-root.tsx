import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "tailwind-variants";

/** The root of an {@link Accordion}: its items, stacked in a column. */
export function AccordionRoot({
  className,
  ...props
}: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}
