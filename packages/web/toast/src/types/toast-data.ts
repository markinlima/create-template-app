import type { ToastCustomRender } from "./toast-custom-render";
import type { ToastPosition } from "./toast-position";
import type { ToastVariant } from "./toast-variant";

/** @internal Data carried inside every Base UI toast object of this lib. */
export interface ToastData {
  variant?: ToastVariant;
  position: ToastPosition;
  render?: ToastCustomRender;
  className?: string;
}
