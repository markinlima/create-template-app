import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "tailwind-variants";

export interface InputProps extends React.ComponentProps<"input"> {
  /** Same raised shadow as the button, to match it side by side. It stays up: no hover or press effect. */
  raised?: boolean;
}

/** The text field of the lib, with its styles. */
export function InputRoot({ className, raised = false, ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        raised &&
          "border-2 shadow-[0_var(--shadow-button-size)_0_0_var(--input)]",
        className,
      )}
      {...props}
    />
  );
}
