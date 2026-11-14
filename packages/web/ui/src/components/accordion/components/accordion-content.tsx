import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "tailwind-variants";

import { ACCORDION_MOTION } from "../../../constants/accordion-motion";

/** The collapsible body of an {@link Accordion} item. It animates its height with {@link ACCORDION_MOTION}. */
export function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm", ACCORDION_MOTION)}
      {...props}
    >
      <div
        className={cn(
          "[&_a]:hover:text-foreground pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}
