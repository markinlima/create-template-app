import type { ToastObject } from "@base-ui/react/toast";
import type { ReactNode } from "react";

import type { ToastData } from "./toast-data";

/** What a custom toast receives: the toast itself and a way to close it. */
export interface ToastCustomContext {
  toast: ToastObject<ToastData>;
  /** Closes this toast. */
  close: () => void;
}

/** Renders your own content inside a toast card. */
export type ToastCustomRender = (context: ToastCustomContext) => ReactNode;
