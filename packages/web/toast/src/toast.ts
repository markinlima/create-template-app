import { toastManagers } from "./lib/toast-managers";
import type { ToastCustomRender } from "./types/toast-custom-render";
import type { ToastData } from "./types/toast-data";
import type { CustomToastOptions, ToastOptions } from "./types/toast-options";
import type { ToastPosition } from "./types/toast-position";
import { toastPositions } from "./types/toast-position";
import type { ToastVariant } from "./types/toast-variant";
import { resolveToastPosition } from "./utils/resolve-toast-position";

const positionByToastId = new Map<string, ToastPosition>();

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
