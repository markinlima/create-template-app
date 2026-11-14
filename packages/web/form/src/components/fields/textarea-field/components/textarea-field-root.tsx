import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Textarea } from "@web/ui/textarea";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the TextareaField: those of a multi-line text input, except the ones the field controls. */
export type TextareaFieldProps = Omit<
  ComponentProps<typeof Textarea>,
  FieldControlOwnedProps
> & {
  /** Hides the `n/max` counter shown when `maxLength` is set. */
  disableCharCounter?: boolean;
};

/**
 * A multi-line text input bound to the field. The `className` goes to the textarea.
 *
 * @param props - See {@link TextareaFieldProps}.
 */
export function TextareaFieldRoot({
  className,
  disableCharCounter,
  maxLength,
  ...props
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();
  const valueLength = field.state.value?.length ?? 0;

  const hasCounter = !disableCharCounter && !!maxLength;

  return (
    <div
      className={cn(
        "relative",
        // NOTE: 24px room for the counter, which shares the label row when a label comes first
        hasCounter && "[&:not(label+*)]:mt-6",
      )}
    >
      {hasCounter && (
        <div className="text-muted-foreground absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem]">
          {valueLength}/{maxLength}
        </div>
      )}
      <Textarea
        {...props}
        className={cn("h-50 resize-none", className)}
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
