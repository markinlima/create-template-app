import type { ReactNode } from "react";

interface RenderSlotProps<TProps> {
  render: (props: TProps) => ReactNode;
  props: TProps;
}

/**
 * Renders a render function as a component with a stable identity.
 *
 * Using the function itself as a component (`<Render />`) would remount everything whenever the
 * caller passes a new function (an inline arrow, for instance). Calling it directly would break
 * if it uses hooks. This keeps both working.
 */
export function RenderSlot<TProps>({ render, props }: RenderSlotProps<TProps>) {
  return <>{render(props)}</>;
}
