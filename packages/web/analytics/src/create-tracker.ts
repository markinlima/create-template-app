import { MAX_QUEUE_SIZE } from "./constants/max-queue-size";
import { MAX_WAIT_MS } from "./constants/max-wait-ms";
import { POLL_INTERVAL_MS } from "./constants/poll-interval-ms";
import type { CreateTrackerOptions } from "./types/create-tracker-options";
import type { QueuedEvent } from "./types/queued-event";
import type { TrackArguments } from "./types/track-arguments";
import type { Tracker } from "./types/tracker";
import type { TrackerEvents } from "./types/tracker-events";
import type { UmamiEventData, UmamiTracker } from "./types/umami-window";

/**
 * Typed wrapper over `window.umami`. It runs only in the browser and does nothing when the
 * tracker script is missing (adblock, unset envs). The script is loaded with `defer`, so events
 * fired on mount wait in a small queue until `window.umami` appears, or are dropped after a while.
 *
 * @typeParam TEvents - The event map of the app: event name to payload.
 * @param options - See {@link CreateTrackerOptions}.
 * @returns The typed `track` and `identify`.
 * @example
 * const { track } = createTracker<{ share: { channel: string }; "sign-in": undefined }>();
 * track("share", { channel: "whatsapp" });
 */
export function createTracker<TEvents extends TrackerEvents>(
  options: CreateTrackerOptions = {},
): Tracker<TEvents> {
  const queue: QueuedEvent[] = [];
  let pollTimer: ReturnType<typeof setInterval> | undefined;

  function sendEvent(umami: UmamiTracker, event: QueuedEvent) {
    try {
      if (event.data === undefined) {
        umami.track(event.name);
        return;
      }

      umami.track(event.name, event.data);
    } catch {
      // NOTE: analytics must never break the UI
    }
  }

  function flushQueue(umami: UmamiTracker) {
    for (const event of queue.splice(0)) {
      sendEvent(umami, event);
    }
  }

  function stopPolling() {
    clearInterval(pollTimer);
    pollTimer = undefined;
  }

  function startPolling() {
    if (pollTimer !== undefined) {
      return;
    }

    const startedAt = Date.now();

    pollTimer = setInterval(() => {
      const umami = window.umami;

      if (umami) {
        stopPolling();
        flushQueue(umami);
        return;
      }

      if (Date.now() - startedAt >= MAX_WAIT_MS) {
        stopPolling();
        queue.length = 0;
      }
    }, POLL_INTERVAL_MS);
  }

  function isEnabled() {
    return typeof options.enabled === "function"
      ? options.enabled()
      : options.enabled !== false;
  }

  function identify(userId: string) {
    if (!isEnabled()) {
      return;
    }

    try {
      window.umami?.identify?.(userId);
    } catch {
      // NOTE: analytics must never break the UI
    }
  }

  function track<TName extends keyof TEvents & string>(
    name: TName,
    ...args: TrackArguments<TEvents[TName]>
  ) {
    if (!isEnabled()) {
      return;
    }

    const data = args[0] as UmamiEventData | undefined;

    if (typeof options.debug === "function" ? options.debug() : options.debug) {
      console.debug("[analytics]", name, data ?? {});
    }

    const umami = window.umami;

    if (!umami) {
      if (queue.length < MAX_QUEUE_SIZE) {
        queue.push({ name, data });
      }

      startPolling();
      return;
    }

    flushQueue(umami);
    sendEvent(umami, { name, data });
  }

  return { track, identify };
}
