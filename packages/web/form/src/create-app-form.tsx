import { createFormHook } from "@tanstack/react-form";

import { CentsField } from "./components/fields/cents-field";
import { CheckboxField } from "./components/fields/checkbox-field";
import { ColorPickerField } from "./components/fields/color-picker-field";
import { CropImageField } from "./components/fields/crop-image-field";
import { NumberField } from "./components/fields/number-field";
import { OTPField } from "./components/fields/otp-field";
import { PasswordField } from "./components/fields/password-field";
import { RadioField } from "./components/fields/radio-field";
import { SelectField } from "./components/fields/select-field";
import { SimpleRelativeDatePicker } from "./components/fields/simple-relative-date-picker";
import { TagsField } from "./components/fields/tags-field";
import { TextField } from "./components/fields/text-field";
import { TextareaField } from "./components/fields/textarea-field";
import { fieldContext, formContext } from "./contexts/app-form-context";

type FormHookOptions = Parameters<typeof createFormHook>[0];
type ComponentsRecord = FormHookOptions["fieldComponents"];

const builtInFieldComponents = {
  TextField,
  TextareaField,
  PasswordField,
  ConfirmCodeField: OTPField,
  ColorPickerField,
  CropImageField,
  SelectField,
  TagsField,
  NumberField,
  CentsField,
  RadioField,
  CheckboxField,
  SimpleRelativeDatePicker,
};

/**
 * Options of {@link createAppForm}.
 */
export interface CreateAppFormOptions<
  TFieldComponents extends ComponentsRecord,
  TFormComponents extends ComponentsRecord,
> {
  /** Project-specific field components. They are added to the built-in ones and override any with the same name. */
  fieldComponents?: TFieldComponents;
  /** Project-specific form components, available as `form.<Name>` inside `<form.AppForm>`. The built-in ones live in the `Form` compound (`Form.submitButton`...). */
  formComponents?: TFormComponents;
  /**
   * Extracts the message shown in `Form.error` when the form's `onSubmit` throws
   * (e.g. an API error). Return `undefined` to fall back to the default message.
   */
  getSubmitErrorMessage?: (error: unknown) => string | undefined;
}

/**
 * Message shown by `Form.error` when the submit fails and the app can't read a message from the error.
 */
export const DEFAULT_SUBMIT_ERROR_MESSAGE =
  "Não foi possível enviar o formulário. Tente novamente.";

/**
 * Creates the app form hooks (`useAppForm`, `withForm`, ...) with the built-in
 * components plus the ones registered by the consuming app.
 *
 * @param options - See {@link CreateAppFormOptions}.
 * @returns The hooks of TanStack Form, with `useAppForm` wrapped to store the errors of `onSubmit`.
 * @example
 * export const { useAppForm, withForm } = createAppForm({
 *   getSubmitErrorMessage: getApiErrorMessage,
 * });
 */
export function createAppForm<
  TFieldComponents extends ComponentsRecord = Record<never, never>,
  TFormComponents extends ComponentsRecord = Record<never, never>,
>(options: CreateAppFormOptions<TFieldComponents, TFormComponents> = {}) {
  const { fieldComponents, formComponents, getSubmitErrorMessage } = options;

  // NOTE: registered components win over built-in ones with the same name
  const hooks = createFormHook({
    fieldComponents: { ...builtInFieldComponents, ...fieldComponents },
    formComponents: { ...formComponents },
    fieldContext,
    formContext,
  });

  const { useAppForm: useBaseAppForm } = hooks;

  // NOTE: TanStack Form rethrows `onSubmit` errors and never stores them, so store one for `Form.error`
  const useAppForm: typeof useBaseAppForm = (formOptions) => {
    const { onSubmit } = formOptions;

    return useBaseAppForm({
      ...formOptions,
      onSubmit: onSubmit
        ? async (props) => {
            try {
              await onSubmit(props);
            } catch (error) {
              const message = getSubmitErrorMessage?.(error);

              // NOTE: unknown error: the user sees the generic text, so log the real one
              if (message === undefined) {
                console.error("[form] onSubmit threw:", error);
              }

              // NOTE: the error map type comes from the validators, which a plain message doesn't satisfy
              props.formApi.setErrorMap({
                onSubmit: message ?? DEFAULT_SUBMIT_ERROR_MESSAGE,
              } as Parameters<typeof props.formApi.setErrorMap>[0]);
            }
          }
        : undefined,
    } as typeof formOptions);
  };

  return { ...hooks, useAppForm };
}
