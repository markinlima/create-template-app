import { useState } from "react";

import { dayjs } from "@web/shared/lib";
import { Input } from "@web/ui/input";
import { Select } from "@web/ui/select";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";

const timeUnits = [
  { value: "d", label: "Dia(s)" },
  { value: "m", label: "Mês(es)" },
  { value: "y", label: "Ano(s)" },
] as const;

type TimeUnit = (typeof timeUnits)[number]["value"];

/** Props of the simple relative date picker. */
export interface SimpleRelativeDatePickerProps {
  /**
   * Lowest amount allowed.
   * @defaultValue 1
   */
  min?: number;
  /** Highest amount allowed. */
  max?: number;
  /** Amount and unit selected before the user changes them. */
  defaultValue?: { number: number; unit: TimeUnit };
}

/**
 * Picks a moment in the future as "in N days/months/years". The field value is the ISO date of that moment.
 *
 * @param props - See {@link SimpleRelativeDatePickerProps}.
 */
export function SimpleRelativeDatePickerRoot({
  min = 1,
  max,
  defaultValue,
}: SimpleRelativeDatePickerProps) {
  const [number, setNumber] = useState(defaultValue?.number || 1);
  const [unit, setUnit] = useState<TimeUnit>(defaultValue?.unit || "d");

  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();

  function handleChange() {
    if (!number) {
      throw new Error("The time value is required");
    }

    if (!unit) {
      throw new Error("The time unit is required");
    }

    const now = dayjs();

    const futureDate = now.add(number, unit);

    field.handleChange(futureDate.toISOString());
  }

  return (
    <div className="flex w-fit items-center gap-2">
      <Input
        className="w-20"
        type="number"
        min={min}
        max={max}
        value={number}
        onChange={(e) => {
          setNumber(Number(e.target.value) || 0);
          handleChange();
        }}
        id={id}
        {...invalidProps}
      />
      <Select
        items={timeUnits}
        value={unit}
        defaultValue={defaultValue?.unit || "d"}
        onValueChange={(value) => {
          setUnit(value ?? "d");
          handleChange();
        }}
      >
        <Select.trigger id={`${id}-unit`} className="w-32">
          <Select.value placeholder="Unidade de tempo" />
        </Select.trigger>
        <Select.content>
          {timeUnits.map((option) => (
            <Select.item key={option.value} value={option.value}>
              {option.label}
            </Select.item>
          ))}
        </Select.content>
      </Select>
    </div>
  );
}
