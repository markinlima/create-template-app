/** A button shown inside a toast, such as "Retry" or "Undo". */
export interface ToastAction {
  label: string;
  onClick: () => void;
}
