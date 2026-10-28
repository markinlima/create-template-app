import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

interface RoundedIconProps extends ComponentProps<"div"> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "destructive"
    | "warn"
    | "success"
    | "info";
}

export function RoundedIconRoot({
  variant = "primary",
  className,
  ...props
}: RoundedIconProps) {
  return (
    <div
      className={cn(
        "flex w-fit items-center justify-center rounded-md p-2",
        {
          "bg-primary/10 text-primary": variant === "primary",
          "bg-secondary/10 text-secondary": variant === "secondary",
          "bg-destructive/10 text-destructive": variant === "destructive",
          "bg-accent/10 text-accent": variant === "accent",
          "bg-warn/10 text-warn": variant === "warn",
          "bg-success/10 text-success": variant === "success",
          "bg-info/10 text-info": variant === "info",
        },
        className,
      )}
      {...props}
    />
  );
}
