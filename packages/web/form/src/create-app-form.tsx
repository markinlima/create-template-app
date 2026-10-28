import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "./context/app-form-context";
import { ColorPickerField } from "./fields/color-picker-field";
import { CropImageField } from "./fields/crop-image-field/crop-image-field";
import { NumberField } from "./fields/number-field";
import { OTPField } from "./fields/otp-field";
import { PasswordField } from "./fields/password-field";
import { RadioField } from "./fields/radio-field";
import { SelectField } from "./fields/select-field";
import { SimpleRelativeDatePicker } from "./fields/simple-relative-date-picker";
import { TagsField } from "./fields/tags-field";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";

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
  RadioField,
  SimpleRelativeDatePicker,
};

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
 * Creates the app form hooks (`useAppForm`, `withForm`, ...) with the built-in
 * components plus the ones registered by the consuming app.
 */
export const DEFAULT_SUBMIT_ERROR_MESSAGE =
  "Não foi possível enviar o formulário. Tente novamente.";

export function createAppForm<
  TFieldComponents extends ComponentsRecord = Record<never, never>,
  TFormComponents extends ComponentsRecord = Record<never, never>,
>(options: CreateAppFormOptions<TFieldComponents, TFormComponents> = {}) {
  const { fieldComponents, formComponents, getSubmitErrorMessage } = options;

  // ? The registered components win over the built-in ones with the same name,
  // ? so the overridden built-in types are dropped from the result.
  const hooks = createFormHook({
    fieldComponents: {
      ...builtInFieldComponents,
      ...fieldComponents,
    } as unknown as Omit<
      typeof builtInFieldComponents,
      keyof TFieldComponents
    > &
      TFieldComponents,
    formComponents: { ...formComponents } as TFormComponents,
    fieldContext,
    formContext,
  });

  const { useAppForm: useBaseAppForm } = hooks;

  // ? TanStack Form rethrows whatever the form's `onSubmit` throws and never stores it in
  // ? the form state. Catch it and store it as the form-level `onSubmit` error so `Form.error`
  // ? can show it. It is cleared by the next validation run (field change/blur or submit).
  const useAppForm: typeof useBaseAppForm = (formOptions) => {
    const { onSubmit } = formOptions;

    return useBaseAppForm({
      ...formOptions,
      onSubmit: onSubmit
        ? async (props) => {
            try {
              await onSubmit(props);
            } catch (error) {
              // ? The error map value type is derived from the form's validators, which a plain message doesn't satisfy.
              props.formApi.setErrorMap({
                onSubmit:
                  getSubmitErrorMessage?.(error) ??
                  DEFAULT_SUBMIT_ERROR_MESSAGE,
              } as Parameters<typeof props.formApi.setErrorMap>[0]);
            }
          }
        : undefined,
    } as typeof formOptions);
  };

  return { ...hooks, useAppForm };
}
