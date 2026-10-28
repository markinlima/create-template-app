import { ALERT_IMPORTANCE_ORDER } from "../constants/alert-importance-behavior";
import type { AlertItem } from "../types/alert-item";

export interface GetPendingAlertsOptions {
  alerts: AlertItem[];
  seenIds: ReadonlySet<string>;
}

/** The alerts not seen yet, in the order they are shown: the most important first, and among equals the order of the list. */
export function getPendingAlerts({ alerts, seenIds }: GetPendingAlertsOptions) {
  const unseen = alerts.filter(
    (alert, index) =>
      !seenIds.has(alert.id) &&
      alerts.findIndex(({ id }) => id === alert.id) === index,
  );

  return unseen.sort(
    (a, b) =>
      ALERT_IMPORTANCE_ORDER.indexOf(a.importance) -
      ALERT_IMPORTANCE_ORDER.indexOf(b.importance),
  );
}
