import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Input } from "@web/ui/input";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the TextField: those of a single-line text input, except the ones the field controls. */
export type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  FieldControlOwnedProps
> & {
  /** Hides the `n/max` counter shown when `maxLength` is set. */
  disableCharCounter?: boolean;
};

/**
 * A single-line text input bound to the field. The `className` goes to the input; the
 * counter (when `maxLength` is set) sits above it.
 *
 * @param props - See {@link TextFieldProps}.
 */
export function TextFieldRoot({
  maxLength,
  disableCharCounter,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();
  const valueLength = field.state.value?.length ?? 0;

  const hasCounter = !disableCharCounter && !!maxLength;

  return (
    <div
      className={cn(
        "relative w-full",
        // NOTE: 24px room for the counter, which shares the label row when a label comes first
        hasCounter && "[&:not(label+*)]:mt-6",
      )}
    >
      {hasCounter && (
        <div className="text-muted-foreground absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem]">
          {valueLength}/{maxLength}
        </div>
      )}
      <Input
        type="text"
        {...props}
        id={id}
        maxLength={maxLength}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
        {...invalidProps}
      />
    </div>
  );
}
