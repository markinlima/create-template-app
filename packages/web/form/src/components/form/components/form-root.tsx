import { type ComponentProps, type SubmitEvent, useRef } from "react";

import { useFormContext } from "../../../contexts/app-form-context";
import { focusFirstInvalidField } from "../../../utils/focus-first-invalid-field";

/**
 * Props of {@link FormRoot}. The submit logic is the `onSubmit` of `useAppForm`, not a prop here,
 * so it never runs before the validation.
 */
export type FormRootProps = Omit<ComponentProps<"form">, "onSubmit" | "ref">;

/**
 * The `form` element. Submitting validates the fields and runs the `onSubmit` of `useAppForm` when they are valid.
 * When they are not, the focus goes to the first invalid control.
 *
 * @param props - See {@link FormRootProps}.
 * @remarks Must be rendered inside `<form.AppForm>`.
 */
export function FormRoot({ children, ...props }: FormRootProps) {
  const form = useFormContext();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    void form.handleSubmit().then(() => {
      if (form.state.isValid) {
        return;
      }

      // NOTE: errors render after this promise, so wait a frame for aria-invalid
      requestAnimationFrame(() => focusFirstInvalidField(formRef.current));
    });
  }

  return (
    <form ref={formRef} {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
