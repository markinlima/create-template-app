import type { AlertImportance } from "../types/alert-item";

interface AlertImportanceBehavior {
  /** Whether the alert can be closed without the button (the X, the outside, Escape). */
  canDismiss: boolean;
  /** Seconds the button waits before it works. */
  cooldownSeconds: number;
}

export const ALERT_IMPORTANCE_BEHAVIOR: Record<
  AlertImportance,
  AlertImportanceBehavior
> = {
  low: { canDismiss: true, cooldownSeconds: 0 },
  high: { canDismiss: false, cooldownSeconds: 0 },
  critical: { canDismiss: false, cooldownSeconds: 5 },
};

/** Most important first: the order the alerts are shown in. */
export const ALERT_IMPORTANCE_ORDER: readonly AlertImportance[] = [
  "critical",
  "high",
  "low",
];
