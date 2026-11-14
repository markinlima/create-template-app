import { HoverCardContent } from "./components/hover-card-content";
import { HoverCardRoot } from "./components/hover-card-root";
import { HoverCardTrigger } from "./components/hover-card-trigger";

/** A popup with more information that opens on hover or focus. */
export const HoverCard = Object.assign(HoverCardRoot, {
  trigger: HoverCardTrigger,
  content: HoverCardContent,
});
