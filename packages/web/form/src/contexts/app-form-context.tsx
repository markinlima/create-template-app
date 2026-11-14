import { createFormHookContexts } from "@tanstack/react-form";

/** Contexts and hooks of TanStack Form's `createFormHook`, shared by every field and form part of the lib. */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
