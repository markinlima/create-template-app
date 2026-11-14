import { type ComponentPropsWithRef, useId } from "react";
import { cn } from "tailwind-variants";

import { FieldIdContext } from "../../../contexts/field-id-context";

/**
 * The layout of one field: the label, the control, the description and the error.
 * It gives them one unique id, so the label and the error link to the control.
 *
 * @param props - Props of the `div` that wraps the field.
 */
export function FieldRoot({
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  const id = useId();

  return (
    <FieldIdContext value={id}>
      <div className={cn("flex w-full flex-col", className)} {...props}>
        {children}
      </div>
    </FieldIdContext>
  );
}
