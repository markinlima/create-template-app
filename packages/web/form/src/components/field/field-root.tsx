import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

export function FieldRoot({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div className={cn("flex w-full flex-col", className)} {...props}>
      {children}
    </div>
  );
}
