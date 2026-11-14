import type { HTMLAttributes } from "react";
import { cn } from "tailwind-variants";

/** The root of a {@link CompactContainer}: the bordered box of its rows. */
export function CompactContainerRoot({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-background relative flex aspect-square size-75 flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
