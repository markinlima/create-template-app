/**
 * The part of a field's meta that tells which errors are shown.
 */
export interface FieldErrorMeta {
  isTouched: boolean;
  errorMap: Record<string, unknown>;
}

/**
 * Lists the errors of a field that `Field.error` shows and that mark the control as invalid.
 * Submit errors are left out (they belong to `Form.error`), and nothing is listed before the field is touched.
 *
 * @param meta - The `meta` of the field (`field.state.meta`).
 * @returns The errors to show, the first one first. Empty when there is nothing to show.
 */
export function getVisibleFieldErrors(meta: FieldErrorMeta) {
  if (!meta.isTouched) {
    return [];
  }

  const { onSubmit: _submitError, ...nonSubmitErrorMap } = meta.errorMap;

  return Object.values(nonSubmitErrorMap).flat().filter(Boolean);
}
