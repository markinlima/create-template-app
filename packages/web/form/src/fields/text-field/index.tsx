import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Input } from "@web/ui/input";

import { useFieldContext } from "../../context/app-form-context";

interface TextFieldProps extends ComponentProps<typeof Input> {
  disableCharCounter?: boolean;
}

export function TextField({
  maxLength,
  disableCharCounter,
  className,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const fieldName = field.name;
  const valueLength = field.state.value?.length ?? 0;

  return (
    <div className={cn(className, "relative w-full")}>
      {!disableCharCounter && maxLength && (
        <div className="absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem] text-muted-foreground">
          {valueLength}/{maxLength}
        </div>
      )}
      <Input
        id={fieldName}
        maxLength={maxLength}
        name={fieldName}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type="text"
        className={className}
        value={field.state.value}
        {...props}
      />
    </div>
  );
}
