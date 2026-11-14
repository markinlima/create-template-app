import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

/** Help text of a `Field`, linked to its control through `aria-describedby`. */
export function FieldDescription({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"p">) {
  return (
    <p
      className={cn("text-muted-foreground mt-2 text-xs", className)}
      {...props}
    >
      {children}
    </p>
  );
}
