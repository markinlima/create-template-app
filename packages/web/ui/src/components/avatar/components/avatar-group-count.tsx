import type * as React from "react";
import { cn } from "tailwind-variants";

/** The counter of the people hidden by an {@link AvatarGroup}, such as `+3`. */
export function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-muted text-muted-foreground relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm [&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}
