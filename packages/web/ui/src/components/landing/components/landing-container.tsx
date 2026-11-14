import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** The width-limited container of a landing section. */
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
      className={cn("relative container flex size-full gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
