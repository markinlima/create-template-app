import { ALERT_IMPORTANCE_ORDER } from "../../constants/alert-importance-behavior";
import type { AlertItem } from "../../types/alert-item";
import type { AlertContentBase } from "../../types/content/alert-content";

/** Options of {@link getPendingAlerts}. */
export interface GetPendingAlertsOptions {
  alerts: AlertItem<AlertContentBase>[];
  seenIds: ReadonlySet<string>;
  /** The content types something can render. An alert of another type is left out. Without it, every type counts. */
  renderableTypes?: readonly string[];
}

/** The alerts not seen yet, in the order they are shown: the most important first, and among equals the order of the list. */
export function getPendingAlerts({
  alerts,
  seenIds,
  renderableTypes,
}: GetPendingAlertsOptions) {
  const unseen = alerts.filter(
    (alert, index) =>
      !seenIds.has(alert.id) &&
      alerts.findIndex(({ id }) => id === alert.id) === index &&
      (!renderableTypes || renderableTypes.includes(alert.content.type)),
  );

  return unseen.sort(
    (a, b) =>
      ALERT_IMPORTANCE_ORDER.indexOf(a.content.importance) -
      ALERT_IMPORTANCE_ORDER.indexOf(b.content.importance),
  );
}
