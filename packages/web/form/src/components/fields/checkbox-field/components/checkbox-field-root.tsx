import type { ReactNode } from "react";

import { Checkbox } from "@web/ui/checkbox";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";

/** Props of the checkbox field. */
export interface CheckboxFieldProps {
  /** What the user is agreeing to. It is the label of the checkbox, so it may hold links (they don't toggle the checkbox). */
  children: ReactNode;
}

/**
 * A checkbox whose value is a boolean (a field that must be ticked, like accepting terms).
 *
 * @param props - See {@link CheckboxFieldProps}.
 */
export function CheckboxFieldRoot({ children }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const { id, invalidProps } = useFieldAria();

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
        {...invalidProps}
        className="mt-0.5"
      />
      <label htmlFor={id} className="cursor-pointer text-sm">
        {children}
      </label>
    </div>
  );
}
