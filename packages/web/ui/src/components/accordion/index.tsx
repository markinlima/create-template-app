import { AccordionContent } from "./components/accordion-content";
import { AccordionItem } from "./components/accordion-item";
import { AccordionRoot } from "./components/accordion-root";
import { AccordionTrigger } from "./components/accordion-trigger";

/** An accordion: sections that open and close. Use `Accordion.item`, `Accordion.trigger` and `Accordion.content`. */
export const Accordion = Object.assign(AccordionRoot, {
  item: AccordionItem,
  trigger: AccordionTrigger,
  content: AccordionContent,
});
