import type { LucideIcon } from "lucide-react";

import { Select } from "@web/ui/select";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";

/** One option of a select field. */
export interface SelectOption {
  /** What the field holds when the option is picked. */
  value: string;
  /** Text shown for the option. */
  label: string;
  /** Icon shown next to the label. */
  icon?: LucideIcon;
}

/** Props of the select field. */
export interface SelectFieldProps {
  /** The options, each with a `value`, a `label` and an optional icon. */
  options: readonly SelectOption[];
  /** Value selected before the user picks one. Only used when the field has no value yet. */
  defaultValue?: string;
  /** Text shown while no option is selected. */
  placeholder?: string;
}

/**
 * A dropdown bound to the field, with the options given as data.
 *
 * @param props - See {@link SelectFieldProps}.
 */
export function SelectFieldRoot({
  options,
  placeholder,
  defaultValue,
}: SelectFieldProps) {
  const field = useFieldContext<string | null>();
  const { id, invalidProps } = useFieldAria();
  const value = field.state.value;

  const ValueIcon = options.find((option) => option.value === value)?.icon;

  return (
    <Select
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={field.handleChange}
    >
      <Select.trigger className="w-45 cursor-pointer" id={id} {...invalidProps}>
        {!!value && ValueIcon && <ValueIcon />}
        <Select.value placeholder={placeholder} />
      </Select.trigger>
      <Select.content>
        {options.map((option) => (
          <Select.item
            className="cursor-pointer"
            key={option.value}
            value={option.value}
          >
            {!!option.icon && <option.icon />}
            {option.label}
          </Select.item>
        ))}
      </Select.content>
    </Select>
  );
}
