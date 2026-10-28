import type { ToastObject } from "@base-ui/react/toast";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const toastPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type ToastPosition = (typeof toastPositions)[number];

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastCustomContext {
  toast: ToastObject<ToastData>;
  /** Closes this toast. */
  close: () => void;
}

export type ToastCustomRender = (context: ToastCustomContext) => ReactNode;

/** @internal Data carried inside every Base UI toast object of this lib. */
export interface ToastData {
  variant?: ToastVariant;
  position: ToastPosition;
  render?: ToastCustomRender;
  className?: string;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Time in ms before the toast closes itself. `0` keeps it until it is closed. */
  timeout?: number;
  /** `high` makes screen readers announce the toast right away. */
  priority?: "low" | "high";
  /** Where the toast shows up. Defaults to the `position` of the `<ToastProvider>`. Always the top on mobile. */
  position?: ToastPosition;
  action?: ToastAction;
  onClose?: () => void;
  onRemove?: () => void;
}

export interface CustomToastOptions extends ToastOptions {
  /** Extra classes for the toast card, e.g. to drop its padding or change its background. */
  className?: string;
}

export interface ToastVariantConfig {
  icon: LucideIcon;
  /** Classes of the tinted gradient behind the toast, e.g. `from-success/10`. */
  className?: string;
  /** Classes of the icon, e.g. `fill-success`. */
  iconClassName?: string;
}
