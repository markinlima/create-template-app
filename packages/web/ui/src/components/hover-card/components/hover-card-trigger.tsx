import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

/** The element that opens its {@link HoverCard} on hover or focus. */
export function HoverCardTrigger({
  ...props
}: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}
