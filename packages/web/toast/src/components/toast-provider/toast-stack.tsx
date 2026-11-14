import { Toast } from "@base-ui/react/toast";

import { toastManagers } from "../../lib/toast-managers";
import type { ToastPosition } from "../../types/toast-position";
import { ToastList } from "./toast-list";

interface ToastStackProps {
  position: ToastPosition;
  timeout: number;
  limit: number;
}

/** The toasts of one screen position, in their own Base UI provider so they stack independently. */
export function ToastStack({ position, timeout, limit }: ToastStackProps) {
  return (
    <Toast.Provider
      toastManager={toastManagers[position]}
      timeout={timeout}
      limit={limit}
    >
      <ToastList position={position} />
    </Toast.Provider>
  );
}
