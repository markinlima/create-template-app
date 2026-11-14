import type { AlertItem } from "./alert-item";
import type { AlertContentBase } from "./content/alert-content";

/** The state of the queue of the dialog and what can be done with it, shared with every component inside the dialog. */
export interface AlertQueueValue {
  /** The alerts of the dialog, in the order they are shown. */
  alerts: AlertItem<AlertContentBase>[];
  /** The alert on the screen. */
  current: AlertItem<AlertContentBase>;
  /** Place of the current alert, from 0. */
  index: number;
  /** How many alerts the dialog has. */
  total: number;
  hasSeveral: boolean;
  isFirst: boolean;
  isLast: boolean;
  /** The current alert was already read in this dialog and is being read again, so there is nothing to wait for. */
  isRevisit: boolean;
  /** Whether the current alert can be closed freely (the X, a click outside, Escape), by its importance. */
  canDismiss: boolean;
  /** Whether the dialog is open. For the dialog itself. */
  isOpen: boolean;
  /** Marks the current alert as seen (once, however many times it is read) and goes to the next one; at the last one it closes the dialog. */
  next: () => void;
  /** Goes to the previous alert. Does nothing at the first one. */
  back: () => void;
  /** Marks the current alert as seen and closes the dialog, whatever its importance. The rest of the queue comes back the next time. */
  close: () => void;
  /** The dialog finished closing. For the dialog itself. */
  complete: () => void;
}
