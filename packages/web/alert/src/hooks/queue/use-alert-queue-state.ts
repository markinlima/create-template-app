import { useCallback, useMemo, useReducer, useRef } from "react";

import { ALERT_IMPORTANCE_BEHAVIOR } from "../../constants/alert-importance-behavior";
import type { AlertItem } from "../../types/alert-item";
import type { AlertQueueValue } from "../../types/alert-queue-value";
import type { AlertContentBase } from "../../types/content/alert-content";
import {
  initialAlertQueueState,
  reduceAlertQueue,
} from "../../utils/queue/reduce-alert-queue";

/** Options of {@link useAlertQueueState}. */
export interface UseAlertQueueStateOptions {
  /** The alerts to show, in order. The list must not change while the dialog is open. */
  alerts: AlertItem<AlertContentBase>[];
  /** Called when an alert was seen: its button was used, or it was closed. Once per alert. */
  onSeen: (alert: AlertItem<AlertContentBase>) => void;
}

/** The state of the queue of the dialog, ready to be shared by the provider. `alerts` must have at least one alert. */
export function useAlertQueueState({
  alerts,
  onSeen,
}: UseAlertQueueStateOptions): AlertQueueValue | null {
  const [state, dispatch] = useReducer(
    reduceAlertQueue,
    initialAlertQueueState,
  );
  const seenIdsRef = useRef(new Set<string>());
  const onSeenRef = useRef(onSeen);
  onSeenRef.current = onSeen;

  const current = alerts[state.index];
  const total = alerts.length;

  // NOTE: going back and forward again must not report a second "seen"
  const markSeen = useCallback((alert: AlertItem<AlertContentBase>) => {
    if (!seenIdsRef.current.has(alert.id)) {
      seenIdsRef.current.add(alert.id);
      onSeenRef.current(alert);
    }
  }, []);

  const next = useCallback(() => {
    if (current) {
      markSeen(current);
    }

    dispatch({ type: "next", total });
  }, [current, markSeen, total]);

  const back = useCallback(() => dispatch({ type: "back" }), []);

  const close = useCallback(() => {
    if (current) {
      markSeen(current);
    }

    dispatch({ type: "close" });
  }, [current, markSeen]);

  const complete = useCallback(() => dispatch({ type: "complete" }), []);

  const { index, furthestIndex, isOpen, isDone } = state;

  return useMemo(() => {
    if (!current || isDone) {
      return null;
    }

    return {
      alerts,
      current,
      index,
      total,
      hasSeveral: total > 1,
      isFirst: index === 0,
      isLast: index === total - 1,
      isRevisit: index < furthestIndex,
      // NOTE: most important first, so a low alert on screen means the required ones were passed
      canDismiss:
        ALERT_IMPORTANCE_BEHAVIOR[current.content.importance].canDismiss,
      isOpen,
      next,
      back,
      close,
      complete,
    };
  }, [
    alerts,
    current,
    index,
    total,
    furthestIndex,
    isOpen,
    isDone,
    next,
    back,
    close,
    complete,
  ]);
}
