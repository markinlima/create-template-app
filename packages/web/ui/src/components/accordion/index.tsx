import { AccordionContent } from "./accordion-content";
import { AccordionItem } from "./accordion-item";
import { AccordionRoot } from "./accordion-root";
import { AccordionTrigger } from "./accordion-trigger";

export const Accordion = Object.assign(AccordionRoot, {
  item: AccordionItem,
  trigger: AccordionTrigger,
  content: AccordionContent,
});
