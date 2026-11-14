/**
 * The part of the form state that decides whether the submit is available.
 */
export interface SubmitState {
  canSubmit: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isDefaultValue: boolean;
}
