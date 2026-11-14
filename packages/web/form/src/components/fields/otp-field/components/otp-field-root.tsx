import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Input } from "@web/ui/input";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the OTPField: those of a one-time code input, except the ones the field controls. */
export type OTPFieldProps = Omit<
  ComponentProps<typeof Input>,
  FieldControlOwnedProps | "type" | "maxLength" | "inputMode" | "pattern"
>;

/**
 * A 6-digit code input. Only digits are kept, and the value is cut at 6 characters.
 *
 * @param props - See {@link OTPFieldProps}.
 */
export function OTPFieldRoot({ className, ...props }: OTPFieldProps) {
  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();

  return (
    <Input
      placeholder="000000"
      {...props}
      className={cn(
        "placeholder:text-muted/50 h-14 w-auto text-center tracking-[0.5em] sm:tracking-[0.8em]",
        className,
      )}
      id={id}
      inputMode="numeric"
      maxLength={6}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "");
        field.handleChange(val.slice(0, 6));
      }}
      pattern="[0-9]*"
      type="text"
      value={field.state.value}
      {...invalidProps}
    />
  );
}
