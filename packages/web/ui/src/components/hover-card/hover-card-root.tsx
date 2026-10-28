import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

export function HoverCardRoot({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}
