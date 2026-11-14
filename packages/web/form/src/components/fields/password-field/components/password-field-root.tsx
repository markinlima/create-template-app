import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { cn } from "tailwind-variants";

import { Button } from "@web/ui/button";
import { Input } from "@web/ui/input";

import { useFieldContext } from "../../../../contexts/app-form-context";
import { useFieldAria } from "../../../../hooks/use-field-aria";
import type { FieldControlOwnedProps } from "../../../../types/field-control-props";

/** Props of the PasswordField: those of a password input with a show/hide toggle, except the ones the field controls. */
export type PasswordFieldProps = Omit<
  ComponentProps<"input">,
  FieldControlOwnedProps | "type"
>;

/**
 * A password input with a button that shows or hides the text. The `className` goes to the input.
 *
 * @param props - See {@link PasswordFieldProps}.
 */
export function PasswordFieldRoot({ className, ...props }: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const field = useFieldContext<string>();
  const { id, invalidProps } = useFieldAria();

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <div className="flex rounded-md">
      <Input
        autoComplete="current-password"
        placeholder="******"
        {...props}
        className={cn(
          "focus-within:border-ring focus-within:ring-ring/50 h-auto rounded-r-none border focus-within:ring-[3px]",
          className,
        )}
        id={id}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type={isPasswordVisible ? "text" : "password"}
        value={field.state.value}
        {...invalidProps}
      />
      <Button
        className="bg-input rounded-l-none"
        onClick={togglePasswordVisibility}
        type="button"
        variant="outline"
        aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
      >
        {isPasswordVisible ? <EyeIcon /> : <EyeClosedIcon />}
      </Button>
    </div>
  );
}
