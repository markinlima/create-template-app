import type { HTMLProps } from "react";
import { cn } from "tailwind-variants";

interface BadgeProps extends HTMLProps<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning";
}

/** The root of a {@link Badge}, with the colors of its variant. */
export function BadgeRoot({
  variant,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "border-primary bg-primary/30 w-fit rounded-sm border px-1.5 py-0.5 text-[8px] font-bold",
        {
          "border-destructive bg-destructive/30": variant === "destructive",
          "border-warn bg-warn/30": variant === "warning",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
