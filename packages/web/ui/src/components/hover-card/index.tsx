import { HoverCardContent } from "./hover-card-content";
import { HoverCardRoot } from "./hover-card-root";
import { HoverCardTrigger } from "./hover-card-trigger";

export const HoverCard = Object.assign(HoverCardRoot, {
  trigger: HoverCardTrigger,
  content: HoverCardContent,
});
