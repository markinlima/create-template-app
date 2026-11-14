/**
 * Moves the focus to the first control of a form that is marked `aria-invalid="true"`.
 *
 * @param container - The form element. Nothing happens when it is `null`.
 * @remarks A control that can't take focus (a group, a `div`) is skipped by the browser, so put `aria-invalid` on a focusable control.
 */
export function focusFirstInvalidField(container: HTMLElement | null) {
  const invalidField = container?.querySelector<HTMLElement>(
    '[aria-invalid="true"]',
  );

  invalidField?.focus();
}
