import { cn } from "tailwind-variants";

/**
 * Optional. Holds the part of a dialog that scrolls (the header and the body), so the footer stays out of it and is always visible.
 * Without it, the whole dialog scrolls, footer included.
 */
export function DialogScrollArea({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-scroll-area"
      className={cn(
        "relative -mx-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4",
        className,
      )}
      {...props}
    />
  );
}
