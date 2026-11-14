import type { ToastPosition } from "../types/toast-position";

/**
 * Position used when a toast doesn't set one. Kept in sync with the `<ToastProvider>`.
 * @defaultValue { defaultPosition: "bottom-right" }
 */
export const toastConfig: { defaultPosition: ToastPosition } = {
  defaultPosition: "bottom-right",
};
