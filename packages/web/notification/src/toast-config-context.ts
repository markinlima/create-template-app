import { type ComponentType, createContext, use } from "react";

import type { BaseToastProps } from "./components/base-toast/base-toast-root";
import type { ToastVariant, ToastVariantConfig } from "./types";

export interface ToastConfigContextValue {
  baseToast: ComponentType<BaseToastProps>;
  variants: Record<ToastVariant, ToastVariantConfig>;
}

export const ToastConfigContext = createContext<ToastConfigContextValue | null>(
  null,
);

export function useToastConfig() {
  const context = use(ToastConfigContext);

  if (!context) {
    throw new Error(
      "Os toasts devem ser renderizados dentro de um <ToastProvider>",
    );
  }

  return context;
}
