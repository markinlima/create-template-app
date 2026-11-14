import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

/** The root of a {@link HoverCard}. */
export function HoverCardRoot({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}
