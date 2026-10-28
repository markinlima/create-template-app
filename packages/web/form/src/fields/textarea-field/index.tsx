import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

import { Textarea } from "@web/ui/textarea";

import { useFieldContext } from "../../context/app-form-context";

interface TextareaFieldProps extends ComponentProps<typeof Textarea> {
  disableCharCounter?: boolean;
}

export function TextareaField({
  className,
  disableCharCounter,
  maxLength,
  ...props
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const valueLength = field.state.value?.length ?? 0;

  return (
    <div className="relative">
      {!disableCharCounter && maxLength && (
        <div className="absolute -top-6 right-0 mt-1 flex w-full justify-end text-[0.625rem] text-muted-foreground">
          {valueLength}/{maxLength}
        </div>
      )}
      <Textarea
        className={cn("h-50 resize-none", className)}
        id={field.name}
        maxLength={maxLength}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
        {...props}
      />
    </div>
  );
}
