import type { ComponentProps, KeyboardEvent, WheelEvent } from "react";

import { Input } from "@web/ui/input";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the NumberField: those of a numeric input, except the ones the field controls. */
export type NumberFieldProps = Omit<
  ComponentProps<typeof Input>,
  FieldControlOwnedProps | "type" | "onKeyDown" | "onWheel"
> & {
  /**
   * Lowest value. Typing, the arrow keys and the wheel never go below it.
   * @defaultValue 0
   */
  min?: number;
  /** Highest value shown in the HTML `max` attribute. The field does not clamp to it. */
  max?: number;
};

/**
 * A numeric input. The arrow keys and the wheel step the value by 1, and the value never goes below `min`.
 *
 * @param props - See {@link NumberFieldProps}.
 */
export function NumberFieldRoot({ min = 0, ...props }: NumberFieldProps) {
  const field = useFieldContext<number | null>();
  const { id, invalidProps } = useFieldAria();

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
  );
}
