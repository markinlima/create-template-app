export interface CanAcknowledgeAlertOptions {
  /** Seconds the button still has to wait. */
  remainingSeconds: number;
  /** The alert asks for a checkbox to be checked first. */
  requiresConfirmation: boolean;
  isConfirmed: boolean;
}

/** Whether the button of an alert works: the wait is over and, when the alert asks for it, the checkbox is checked. */
export function canAcknowledgeAlert({
  remainingSeconds,
  requiresConfirmation,
  isConfirmed,
}: CanAcknowledgeAlertOptions) {
  return remainingSeconds === 0 && (!requiresConfirmation || isConfirmed);
}
