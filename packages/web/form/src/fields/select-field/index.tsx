import type { LucideIcon } from "lucide-react";

import { Select } from "@web/ui/select";

import { useFieldContext } from "../../context/app-form-context";

export interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SelectFieldProps {
  options: readonly SelectOption[];
  defaultValue?: string;
  placeholder?: string;
}

export function SelectField({
  options,
  placeholder,
  defaultValue,
}: SelectFieldProps) {
  const field = useFieldContext<string | null>();
  const value = field.state.value;

  const ValueIcon = options.find((option) => option.value === value)?.icon;

  return (
    <Select
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={field.handleChange}
    >
      <Select.trigger id={field.name} className="w-45 cursor-pointer">
        {!!value && ValueIcon && <ValueIcon />}
        <Select.value placeholder={placeholder} />
      </Select.trigger>
      <Select.content>
        {options.map((value) => (
          <Select.item
            className="cursor-pointer"
            key={value.value}
            value={value.value}
          >
            {!!value.icon && <value.icon />}
            {value.label}
          </Select.item>
        ))}
      </Select.content>
    </Select>
  );
}
