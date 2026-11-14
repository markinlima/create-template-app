import { tv } from "tailwind-variants";

/** The screen area of each position's stack. On mobile only `top-center` is used, full width. */
export const toastViewport = tv({
  base: "fixed z-9999 mx-auto flex h-fit w-62.5 sm:w-75",
  variants: {
    position: {
      "top-left": "top-2 left-2 [--stack-dir:1] sm:top-8 sm:left-8",
      "top-center":
        "top-[max(0.5rem,env(safe-area-inset-top))] left-2 w-[calc(100%-1rem)] [--stack-dir:1] sm:top-8 sm:left-1/2 sm:w-75 sm:-translate-x-1/2",
      "top-right": "top-2 right-2 [--stack-dir:1] sm:top-8 sm:right-8",
      "bottom-left": "bottom-2 left-2 [--stack-dir:-1] sm:bottom-8 sm:left-8",
      "bottom-center":
        "bottom-2 left-1/2 -translate-x-1/2 [--stack-dir:-1] sm:bottom-8",
      "bottom-right":
        "right-2 bottom-2 [--stack-dir:-1] sm:right-8 sm:bottom-8",
    },
  },
});

/** One toast card. It is glued to the top or the bottom edge, and grows from that edge. */
export const toastCard = tv({
  base: "toast-root bg-background text-foreground absolute inset-x-0 box-border w-full rounded-lg border bg-clip-padding p-4 shadow-lg transition-all select-none",
  variants: {
    placement: {
      top: "top-0 origin-top",
      bottom: "bottom-0 origin-bottom",
    },
  },
});
