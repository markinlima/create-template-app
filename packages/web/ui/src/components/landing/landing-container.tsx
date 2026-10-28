import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export function LandingContainer({
  className,
  children,
  ref,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="container"
      className={cn("container relative flex size-full gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
