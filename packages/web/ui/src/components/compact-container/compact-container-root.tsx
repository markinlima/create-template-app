import type { HTMLAttributes } from "react";
import { cn } from "tailwind-variants";

export function CompactContainerRoot({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex aspect-square size-75 flex-col overflow-hidden rounded-md bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
