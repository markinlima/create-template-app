import { cn } from "tailwind-variants";

import { RadioGroup } from "@web/ui/radio-group";

import { useFieldContext } from "../context/app-form-context";

export interface RadioFieldValue {
  value: string;
  label?: string;
}

interface RadioFieldProps {
  values: RadioFieldValue[];
  defaultValue?: string;
  className?: string;
  variant?: "card" | "text";
}

export function RadioField({
  values,
  variant = "card",
  className,
  defaultValue,
}: RadioFieldProps) {
  const field = useFieldContext<string>();

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
    >
      {values.map(({ label, value }) => {
        const isCurrent = field.state.value === value;

        return (
          <label
            key={value}
            className={cn(
              "mb-0 flex cursor-pointer gap-2 font-medium transition-all",
              {
                "border-primary": isCurrent,
                "": variant === "text",
                "rounded-md border px-2 py-4 hover:bg-accent/30 focus:bg-accent/30":
                  variant === "card",
              },
            )}
            htmlFor={value}
          >
            <RadioGroup.item value={value} id={value} />
            {label ?? value}
          </label>
        );
      })}
    </RadioGroup>
  );
}
