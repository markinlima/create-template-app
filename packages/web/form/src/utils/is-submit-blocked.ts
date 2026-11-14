import type { SubmitState } from "../types/submit-state";

/**
 * Options of {@link isSubmitBlocked}.
 */
export interface IsSubmitBlockedOptions {
  /**
   * Also block the submit while the values are still the default ones.
   * @defaultValue false
   */
  disableOnDefaultValue?: boolean;
}

/**
 * Tells whether a submit button must be disabled.
 *
 * @param state - The submit state of the form.
 * @param options - See {@link IsSubmitBlockedOptions}.
 * @returns `true` when the form can't be submitted right now.
 */
export function isSubmitBlocked(
  state: SubmitState,
  options: IsSubmitBlockedOptions = {},
) {
  const { canSubmit, isValid, isSubmitting, isDefaultValue } = state;

  return (
    !canSubmit ||
    !isValid ||
    isSubmitting ||
    (!!options.disableOnDefaultValue && isDefaultValue)
  );
}
