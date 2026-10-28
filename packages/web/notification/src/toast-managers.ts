import { Toast } from "@base-ui/react/toast";

import { type ToastData, type ToastPosition, toastPositions } from "./types";

/**
 * One Base UI toast manager per screen position. Base UI stacks and animates every toast of a
 * provider together, so toasts of different positions must live in different providers.
 */
export const toastManagers = Object.fromEntries(
  toastPositions.map((position) => [
    position,
    Toast.createToastManager<ToastData>(),
  ]),
) as Record<
  ToastPosition,
  ReturnType<typeof Toast.createToastManager<ToastData>>
>;
