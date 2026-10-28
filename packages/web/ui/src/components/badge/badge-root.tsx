import type { HTMLProps } from "react";
import { cn } from "tailwind-variants";

interface BadgeProps extends HTMLProps<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning";
}

export function BadgeRoot({
  variant,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "w-fit rounded-sm border border-primary bg-primary/30 px-1.5 py-0.5 font-bold text-[8px]",
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
