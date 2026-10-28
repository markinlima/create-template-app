import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

export function FieldDescription({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"p">) {
  return (
    <p
      className={cn("mt-2 text-muted-foreground text-xs", className)}
      {...props}
    >
      {children}
    </p>
  );
}
