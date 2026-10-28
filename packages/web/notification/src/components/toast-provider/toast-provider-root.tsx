import { type ComponentType, type ReactNode, useEffect, useMemo } from "react";

import { toastConfig } from "../../toast";
import {
  ToastConfigContext,
  type ToastConfigContextValue,
} from "../../toast-config-context";
import { defaultToastVariants } from "../../toast-variants";
import {
  type ToastPosition,
  type ToastVariant,
  type ToastVariantConfig,
  toastPositions,
} from "../../types";
import { BaseToast, type BaseToastProps } from "../base-toast";
import { ToastStack } from "./toast-stack";

interface ToastProviderProps {
  children: ReactNode;
  /** Where toasts show up when they don't set a `position`. @default "bottom-right" */
  position?: ToastPosition;
  /** Time in ms before a toast closes itself. @default 5000 */
  timeout?: number;
  /** How many toasts of the same position are visible at once. @default 5 */
  limit?: number;
  /** Replaces the layout of the basic toasts (success, error, warning, info). */
  baseToast?: ComponentType<BaseToastProps>;
  /** Overrides the icon/colors of the basic toasts. Only the given fields are replaced. */
  variants?: Partial<Record<ToastVariant, Partial<ToastVariantConfig>>>;
}

/**
 * Renders the toasts of the whole app and wires the `toast` API to them.
 * Place it once, high in the tree (e.g. the root route).
 */
export function ToastProviderRoot({
  children,
  position = "bottom-right",
  timeout = 5000,
  limit = 5,
  baseToast = BaseToast,
  variants,
}: ToastProviderProps) {
  useEffect(() => {
    toastConfig.defaultPosition = position;
  }, [position]);

  const config = useMemo<ToastConfigContextValue>(() => {
    const mergedVariants = { ...defaultToastVariants };
    for (const variant of Object.keys(mergedVariants) as ToastVariant[]) {
      mergedVariants[variant] = {
        ...defaultToastVariants[variant],
        ...variants?.[variant],
      };
    }

    return { baseToast, variants: mergedVariants };
  }, [baseToast, variants]);

  return (
    <ToastConfigContext value={config}>
      {children}
      {toastPositions.map((toastPosition) => (
        <ToastStack
          key={toastPosition}
          position={toastPosition}
          timeout={timeout}
          limit={limit}
        />
      ))}
    </ToastConfigContext>
  );
}
