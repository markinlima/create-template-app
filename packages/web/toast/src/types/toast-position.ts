/** Where a toast can show up: the six positions of the screen. */
export const toastPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

/** One of {@link toastPositions}. */
export type ToastPosition = (typeof toastPositions)[number];
