import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** The root of a landing page. */
export function LandingPage({
  className,
  children,
  ref,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="landing"
      className={cn(
        "relative mt-[calc(2rem+var(--header-height))] flex size-full h-fit min-h-175 flex-col items-center gap-20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
