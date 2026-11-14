import type { AlertImportance } from "../types/content/alert-content";

interface AlertImportanceBehavior {
  /** Whether the alert can be closed without the button (the X, the outside, Escape). */
  canDismiss: boolean;
  /** Seconds the button waits before it works. */
  cooldownSeconds: number;
}

/** How each importance lets an alert be closed, and how long its button waits. */
export const ALERT_IMPORTANCE_BEHAVIOR: Record<
  AlertImportance,
  AlertImportanceBehavior
> = {
  low: { canDismiss: true, cooldownSeconds: 0 },
  medium: { canDismiss: false, cooldownSeconds: 0 },
  high: { canDismiss: false, cooldownSeconds: 5 },
};

/** Most important first: the order the alerts are shown in. */
export const ALERT_IMPORTANCE_ORDER: readonly AlertImportance[] = [
  "high",
  "medium",
  "low",
];
