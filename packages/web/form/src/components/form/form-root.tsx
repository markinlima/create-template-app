import type { ComponentPropsWithRef, SubmitEvent } from "react";

import { useFormContext } from "../../context/app-form-context";

export function FormRoot({
  onSubmit,
  children,
  ...props
}: ComponentPropsWithRef<"form">) {
  const form = useFormContext();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    onSubmit?.(event);
    form.handleSubmit();
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
