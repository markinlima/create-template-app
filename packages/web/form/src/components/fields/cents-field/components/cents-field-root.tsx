import type { ComponentProps, KeyboardEvent, WheelEvent } from "react";

import { beautifyCents } from "@web/shared/utils";
import { Input } from "@web/ui/input";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the CentsField: those of cents (an integer) as a currency input, except the ones the field controls. */
export type CentsFieldProps = Omit<
  ComponentProps<typeof Input>,
  FieldControlOwnedProps | "type" | "onKeyDown" | "onWheel"
> & {
  /**
   * Lowest value, in cents. Typing, the arrow keys and the wheel never go below it.
   * @defaultValue 0
   */
  min?: number;
  /** Highest value, in cents, shown in the HTML `max` attribute. The field does not clamp to it. */
  max?: number;
};

/**
 * An amount in cents typed as a number, with the formatted value (e.g. `1999` → `R$ 19,99`) next to it.
 *
 * @param props - See {@link CentsFieldProps}.
 */
export function CentsFieldRoot({ min = 0, ...props }: CentsFieldProps) {
  const field = useFieldContext<number | null>();
  const { id, invalidProps } = useFieldAria();
  const value = field.state.value;

  function handleChange(inputValue: string) {
    let value: number = Number(inputValue);

    if (Number.isNaN(value)) {
      value = 0;
    }

    if (value < min) {
      value = min;
    }

    field.handleChange(value);
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    const currentValue = field.state.value || 0;
    let newValue = currentValue;

    if (event.deltaY < 0) {
      newValue = currentValue + 1;
    } else if (event.deltaY > 0) {
      newValue = currentValue - 1;
    }

    if (newValue < min) {
      newValue = min;
    }

    field.handleChange(newValue);
  }

  function handleKey(event: KeyboardEvent) {
    const currentValue = field.state.value || 0;
    let newValue = currentValue;

    if (event.key === "ArrowUp") {
      newValue = currentValue + 1;
    } else if (event.key === "ArrowDown") {
      newValue = currentValue - 1;
    }

    if (newValue < min) {
      newValue = min;
    }

    field.handleChange(newValue);
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        min={min}
        {...props}
        id={id}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKey}
        onWheel={handleWheel}
        type="text"
        value={field.state.value?.toString() || ""}
        {...invalidProps}
      />
      <p>{value ? beautifyCents(value) : 0}</p>
    </div>
  );
}
