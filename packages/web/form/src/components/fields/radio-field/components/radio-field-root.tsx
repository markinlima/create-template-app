import { cn } from "tailwind-variants";

import { RadioGroup } from "@web/ui/radio-group";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";

/** One option of a radio field. */
export interface RadioFieldValue {
  /** What the field holds when the option is picked. */
  value: string;
  /** Text shown for the option; the value when missing. */
  label?: string;
}

/** Props of the radio field. */
export interface RadioFieldProps {
  /** The options. The label is shown when given, the value otherwise. */
  values: RadioFieldValue[];
  /** Value selected before the user picks one. */
  defaultValue?: string;
  /** Classes of the group of options. */
  className?: string;
  /**
   * `card` shows each option as a bordered box; `text` shows plain rows.
   * @defaultValue "card"
   */
  variant?: "card" | "text";
}

/**
 * A group of radio options bound to the field, one value at a time.
 *
 * @param props - See {@link RadioFieldProps}.
 */
export function RadioFieldRoot({
  values,
  variant = "card",
  className,
  defaultValue,
}: RadioFieldProps) {
  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();

  return (
    <RadioGroup
      className={cn(
        "flex flex-col gap-1",
        {
          "gap-4": variant === "text",
        },
        className,
      )}
      name={field.name}
      value={field.state.value}
      onValueChange={field.handleChange}
      defaultValue={defaultValue}
      {...invalidProps}
    >
      {values.map(({ label, value }) => {
        const isCurrent = field.state.value === value;
        const optionId = `${id}-${value}`;

        return (
          <label
            key={value}
            className={cn(
              "mb-0 flex cursor-pointer gap-2 font-medium transition-all",
              {
                "border-primary": isCurrent,
                "": variant === "text",
                "hover:bg-accent/30 focus:bg-accent/30 rounded-md border px-2 py-4":
                  variant === "card",
              },
            )}
            htmlFor={optionId}
          >
            <RadioGroup.item value={value} id={optionId} />
            {label ?? value}
          </label>
        );
      })}
    </RadioGroup>
  );
}
