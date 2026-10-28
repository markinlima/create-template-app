import { useState } from "react";

import { dayjs } from "@web/shared/lib/dayjs";
import { Input } from "@web/ui/input";
import { Select } from "@web/ui/select";

import { useFieldContext } from "../context/app-form-context";

const timeUnits = [
  { value: "d", label: "Dia(s)" },
  { value: "m", label: "Mês(es)" },
  { value: "y", label: "Ano(s)" },
] as const;

type TimeUnit = (typeof timeUnits)[number]["value"];

interface SimpleRelativeDatePickerProps {
  min?: number;
  max?: number;
  defaultValue?: { number: number; unit: TimeUnit };
}

export function SimpleRelativeDatePicker({
  min = 1,
  max,
  defaultValue,
}: SimpleRelativeDatePickerProps) {
  const [number, setNumber] = useState(defaultValue?.number || 1);
  const [unit, setUnit] = useState<TimeUnit>(defaultValue?.unit || "d");

  const field = useFieldContext<string>();

  function handleChange() {
    if (!number) {
      throw new Error("O valor de tempo é obrigatório");
    }

    if (!unit) {
      throw new Error("A unidade de tempo é obrigatória");
    }

    const now = dayjs();

    const futureDate = now.add(number, unit);

    field.handleChange(futureDate.toISOString());
  }

  return (
    <div className="flex w-fit items-center gap-2">
      <Input
        id={field.name}
        className="w-20"
        type="number"
        min={min}
        max={max}
        value={number}
        onChange={(e) => {
          setNumber(Number(e.target.value) || 0);
          handleChange();
        }}
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
        <Select.trigger id={field.name} className="w-32">
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
