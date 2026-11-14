import type { ToastPosition } from "../types/toast-position";

/** The directions a toast can be swiped away to, from each position. */
export const toastSwipeDirection: Record<
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
