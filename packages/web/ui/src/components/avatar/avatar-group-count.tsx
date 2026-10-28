import type * as React from "react";
import { cn } from "tailwind-variants";

export function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm [&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}
