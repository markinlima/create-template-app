import { toastConfig } from "../lib/toast-config";
import type { ToastPosition } from "../types/toast-position";
import { isMobileViewport } from "./is-mobile-viewport";

/**
 * Where a toast is shown: the position it asked for, or the default one. On mobile it is always the top.
 * @param position - The position the toast asked for. Defaults to the `<ToastProvider>` position.
 * @returns The position the toast is rendered in.
 */
export function resolveToastPosition(
  position: ToastPosition = toastConfig.defaultPosition,
): ToastPosition {
  return isMobileViewport() ? "top-center" : position;
}
