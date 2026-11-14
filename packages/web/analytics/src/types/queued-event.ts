import type { UmamiEventData } from "./umami-window";

/** An event waiting for `window.umami` to load. */
export interface QueuedEvent {
  name: string;
  data: UmamiEventData | undefined;
}
