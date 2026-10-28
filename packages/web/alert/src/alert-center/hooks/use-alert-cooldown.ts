import { useEffect, useState } from "react";

import { getRemainingCooldown } from "../utils/get-remaining-cooldown";

const TICK_MS = 250;

/** Seconds left of a cooldown that starts when the component mounts. Give the component a `key` to start it again. */
export function useAlertCooldown(cooldownSeconds: number) {
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (
        getRemainingCooldown({ startedAt, now: current, cooldownSeconds }) === 0
      ) {
        clearInterval(interval);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [startedAt, cooldownSeconds]);

  return getRemainingCooldown({ startedAt, now, cooldownSeconds });
}
