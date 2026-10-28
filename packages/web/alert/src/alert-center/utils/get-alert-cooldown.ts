import { ALERT_IMPORTANCE_BEHAVIOR } from "../constants/alert-importance-behavior";
import type { AlertItem } from "../types/alert-item";

export interface GetAlertCooldownOptions
  extends Pick<AlertItem, "importance" | "cooldownSeconds"> {
  /** The alert was already read in this dialog and is being read again, so there is nothing to wait for. */
  isRevisit?: boolean;
}

/** Seconds the button of an alert waits before it works: the one the alert asks for, or the one of its importance. */
export function getAlertCooldown({
  importance,
  cooldownSeconds,
  isRevisit = false,
}: GetAlertCooldownOptions) {
  const behavior = ALERT_IMPORTANCE_BEHAVIOR[importance];

  // ? An alert that doesn't need to be read (low), or that was already read, has nothing to wait for.
  if (behavior.canDismiss || isRevisit) {
    return 0;
  }

  return cooldownSeconds ?? behavior.cooldownSeconds;
}
