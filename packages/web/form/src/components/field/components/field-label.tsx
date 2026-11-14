import type { ComponentPropsWithRef } from "react";
import { cn } from "tailwind-variants";

import { useFieldAria } from "../../../hooks/use-field-aria";

interface FieldLabelProps extends ComponentPropsWithRef<"label"> {
  /** Shows a red `*` after the text. It does not add validation. */
  required?: boolean;
}

/**
 * The visible label of the field. It is linked to the control through `htmlFor`.
 *
 * @param props - Props of the `label` element, plus {@link FieldLabelProps.required}.
 */
export function FieldLabel({
  children,
  className,
  required,
  ...props
}: FieldLabelProps) {
  const { id } = useFieldAria();

  return (
    <label
      className={cn(
        "mb-4 flex items-center gap-2 text-sm leading-none font-bold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      htmlFor={id}
      {...props}
    >
      {children}
      {!!required && <span className="text-destructive">*</span>}
    </label>
  );
}
