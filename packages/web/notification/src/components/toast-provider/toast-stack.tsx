import { Toast } from "@base-ui/react/toast";
import { cn } from "tailwind-variants";

import { useToastConfig } from "../../toast-config-context";
import { toastManagers } from "../../toast-managers";
import type { ToastData, ToastPosition } from "../../types";

/** Where each stack sits on the screen. On mobile only `top-center` is used, full width. */
const viewportClassName: Record<ToastPosition, string> = {
  "top-left": "top-2 left-2 [--stack-dir:1] sm:top-8 sm:left-8",
  "top-center":
    "top-[max(0.5rem,env(safe-area-inset-top))] left-2 w-[calc(100%-1rem)] [--stack-dir:1] sm:top-8 sm:left-1/2 sm:w-75 sm:-translate-x-1/2",
  "top-right": "top-2 right-2 [--stack-dir:1] sm:top-8 sm:right-8",
  "bottom-left": "bottom-2 left-2 [--stack-dir:-1] sm:bottom-8 sm:left-8",
  "bottom-center":
    "bottom-2 left-1/2 -translate-x-1/2 [--stack-dir:-1] sm:bottom-8",
  "bottom-right": "right-2 bottom-2 [--stack-dir:-1] sm:right-8 sm:bottom-8",
};

/** Edge of the viewport the cards are glued to, and the side they grow to. */
const rootPlacementClassName = {
  top: "top-0 origin-top",
  bottom: "bottom-0 origin-bottom",
};

const swipeDirection: Record<
  ToastPosition,
  ("up" | "down" | "left" | "right")[]
> = {
  "top-left": ["up", "left"],
  "top-center": ["up"],
  "top-right": ["up", "right"],
  "bottom-left": ["down", "left"],
  "bottom-center": ["down"],
  "bottom-right": ["down", "right"],
};

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

function ToastList({ position }: { position: ToastPosition }) {
  const { toasts } = Toast.useToastManager<ToastData>();
  const { baseToast: BaseToast, variants } = useToastConfig();
  const placement = position.startsWith("top") ? "top" : "bottom";

  return (
    <Toast.Portal>
      <Toast.Viewport
        className={cn(
          "fixed z-10 mx-auto flex h-fit w-62.5 sm:w-75",
          viewportClassName[position],
        )}
      >
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            swipeDirection={swipeDirection[position]}
            className={cn(
              "toast-root absolute inset-x-0 box-border w-full select-none rounded-lg border bg-background bg-clip-padding p-4 text-foreground shadow-lg transition-all",
              rootPlacementClassName[placement],
              toast.data?.className,
            )}
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
