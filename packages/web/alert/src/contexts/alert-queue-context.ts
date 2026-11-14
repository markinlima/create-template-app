import { createContext } from "react";

import type { AlertQueueValue } from "../types/alert-queue-value";

/** Context of the alert dialog's queue; read it through `useAlertQueue`. */
export const AlertQueueContext = createContext<AlertQueueValue | null>(null);
