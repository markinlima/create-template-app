import type { ReactNode } from "react";

import type { ToastAction } from "./toast-action";
import type { ToastPosition } from "./toast-position";

/** The options of every toast. */
export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /**
   * Time in ms before the toast closes itself. `0` keeps it until it is closed.
   * @defaultValue 5000
   */
  timeout?: number;
  /** `high` makes screen readers announce the toast right away. */
  priority?: "low" | "high";
  /** Where the toast shows up. Defaults to the `position` of the `<ToastProvider>`. Always the top on mobile. */
  position?: ToastPosition;
  action?: ToastAction;
  onClose?: () => void;
  onRemove?: () => void;
}

/** The options of a custom toast, which can also change its card. */
export interface CustomToastOptions extends ToastOptions {
  /** Extra classes for the toast card, e.g. to drop its padding or change its background. */
  className?: string;
}
