import { Toast } from "@base-ui/react/toast";

import { toastCard, toastViewport } from "../../constants/toast-placement";
import { toastSwipeDirection } from "../../constants/toast-swipe-direction";
import { useToastConfig } from "../../contexts/toast-config-context";
import { toastManagers } from "../../lib/toast-managers";
import type { ToastData } from "../../types/toast-data";
import type { ToastPosition } from "../../types/toast-position";

interface ToastListProps {
  position: ToastPosition;
}

/** Renders the toasts of one position inside its viewport. */
export function ToastList({ position }: ToastListProps) {
  const { toasts } = Toast.useToastManager<ToastData>();
  const { baseToast: BaseToast, variants } = useToastConfig();
  const placement = position.startsWith("top") ? "top" : "bottom";

  return (
    <Toast.Portal>
      <Toast.Viewport className={toastViewport({ position })}>
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            swipeDirection={toastSwipeDirection[position]}
            role={toast.data?.variant === "error" ? "alert" : "status"}
            className={toastCard({
              placement,
              className: toast.data?.className,
            })}
          >
            {toast.data?.render ? (
              <Toast.Content>
                {toast.data.render({
                  toast,
                  close: () => toastManagers[position].close(toast.id),
                })}
              </Toast.Content>
            ) : (
              <BaseToast
                toast={toast}
                variant={variants[toast.data?.variant ?? "info"]}
              />
            )}
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
