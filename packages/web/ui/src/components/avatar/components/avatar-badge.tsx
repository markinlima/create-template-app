import type * as React from "react";
import { cn } from "tailwind-variants";

/** A small badge over an {@link Avatar}, such as a status. */
export function AvatarBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
        className,
      )}
      {...props}
    />
  );
}
