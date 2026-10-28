import { toastManagers } from "./toast-managers";
import type {
  CustomToastOptions,
  ToastCustomRender,
  ToastData,
  ToastOptions,
  ToastPosition,
  ToastVariant,
} from "./types";
import { toastPositions } from "./types";

/** Matches Tailwind's `sm` breakpoint: below it the toasts are always shown at the top. */
const MOBILE_MEDIA_QUERY = "(max-width: 639.98px)";

/** Position used when a toast doesn't set one. Kept in sync with the `<ToastProvider>`. */
export const toastConfig: { defaultPosition: ToastPosition } = {
  defaultPosition: "bottom-right",
};

const positionByToastId = new Map<string, ToastPosition>();

function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(MOBILE_MEDIA_QUERY).matches
  );
}

export function resolveToastPosition(
  position: ToastPosition = toastConfig.defaultPosition,
): ToastPosition {
  return isMobileViewport() ? "top-center" : position;
}

interface AddOptions extends CustomToastOptions {
  variant?: ToastVariant;
  render?: ToastCustomRender;
}

function add(options: AddOptions) {
  const {
    variant,
    render,
    className,
    position: requestedPosition,
    action,
    onRemove,
    ...toastOptions
  } = options;
  const position = resolveToastPosition(requestedPosition);
  const data: ToastData = { variant, render, className, position };

  const id = toastManagers[position].add({
    ...toastOptions,
    type: variant ?? "custom",
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
    data,
    onRemove: () => {
      positionByToastId.delete(id);
      onRemove?.();
    },
  });

  positionByToastId.set(id, position);

  return id;
}

/**
 * Programmatic toast API, usable from anywhere (including outside React).
 * Every method returns the id of the toast, which `toast.dismiss` accepts.
 *
 * @example
 * toast.success({ title: "Saved!", description: "Your changes were saved." });
 * toast.error({ title: "Error", position: "top-center", action: { label: "Retry", onClick: retry } });
 * toast.custom(({ close }) => <NewMessage onOpen={close} />, { position: "top-right" });
 */
export const toast = {
  success: (options: ToastOptions) => add({ ...options, variant: "success" }),
  error: (options: ToastOptions) => add({ ...options, variant: "error" }),
  warning: (options: ToastOptions) => add({ ...options, variant: "warning" }),
  info: (options: ToastOptions) => add({ ...options, variant: "info" }),
  /** Shows your own component inside the toast card (stacking, swipe, timeout and position still apply). */
  custom: (render: ToastCustomRender, options: CustomToastOptions = {}) =>
    add({ ...options, render }),
  /** Closes the toast with this id, or every toast when no id is given. */
  dismiss: (id?: string) => {
    if (id === undefined) {
      for (const position of toastPositions) {
        toastManagers[position].close();
      }
      return;
    }

    const position = positionByToastId.get(id);
    if (position) {
      toastManagers[position].close(id);
    }
  },
};
