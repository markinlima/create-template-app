import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "tailwind-variants";

/** The root of a {@link Switch}: the track and the thumb of the toggle. */
export function SwitchRoot({
  className,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer bg-input focus-visible:ring-ring/50 data-checked:bg-primary relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors outline-none after:absolute after:-inset-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="bg-background pointer-events-none block size-5 rounded-full shadow-sm ring-0 transition-transform data-checked:translate-x-5 data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}
