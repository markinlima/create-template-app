import { cn } from "tailwind-variants";

import { Input } from "@web/ui/input";

import { useFieldContext } from "../../context/app-form-context";

interface OTPFieldProps {
  className?: string;
}

export function OTPField({ className, ...props }: OTPFieldProps) {
  const field = useFieldContext<string>();
  const fieldName = field.name;

  return (
    <Input
      className={cn(
        "h-14 w-auto text-center tracking-[0.5em] placeholder:text-muted/50 sm:tracking-[0.8em]",
        className,
      )}
      id={fieldName}
      inputMode="numeric"
      maxLength={6}
      name={fieldName}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "");
        field.handleChange(val.slice(0, 6));
      }}
      pattern="[0-9]*"
      placeholder="000000"
      type="text"
      value={field.state.value}
      {...props}
    />
  );
}
