import type { UmamiEventData } from "./umami-window";

/** Map of event name to its payload. An event mapped to `undefined` takes no data. */
export type TrackerEvents = Record<string, UmamiEventData | undefined>;
