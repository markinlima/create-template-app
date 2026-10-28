import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFieldContext } from "../../context/app-form-context";

interface FieldLabelProps extends ComponentPropsWithRef<"label"> {
  required?: boolean;
}

export function FieldLabel({
  children,
  className,
  required,
  ...props
}: FieldLabelProps) {
  const field = useFieldContext();

  return (
    <label
      className={cn(
        "mb-4 flex select-none items-center gap-2 font-bold text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
      )}
      htmlFor={field.name}
      {...props}
    >
      {children}
      {!!required && <span className="text-destructive">*</span>}
    </label>
  );
}
