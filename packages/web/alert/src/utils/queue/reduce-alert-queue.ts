/** Where the queue of the dialog is. */
export interface AlertQueueState {
  /** Place of the alert on the screen, from 0. */
  index: number;
  /** How far the user got: the alerts before it were already read. */
  furthestIndex: number;
  isOpen: boolean;
  /** The dialog finished closing, so nothing is drawn any more. */
  isDone: boolean;
}

/** What the user can do to the queue. */
export type AlertQueueAction =
  | { type: "next"; total: number }
  | { type: "back" }
  | { type: "close" }
  | { type: "complete" };

/** The queue when the dialog opens: at the first alert, open. */
export const initialAlertQueueState: AlertQueueState = {
  index: 0,
  furthestIndex: 0,
  isOpen: true,
  isDone: false,
};

/** Where the queue goes for each thing the user does. */
export function reduceAlertQueue(
  state: AlertQueueState,
  action: AlertQueueAction,
): AlertQueueState {
  switch (action.type) {
    case "next": {
      // NOTE: the last alert has no next one: its button closes the dialog.
      if (state.index >= action.total - 1) {
        return { ...state, isOpen: false };
      }

      const index = state.index + 1;

      return {
        ...state,
        index,
        furthestIndex: Math.max(state.furthestIndex, index),
      };
    }
    case "back":
      return { ...state, index: Math.max(0, state.index - 1) };
    case "close":
      return { ...state, isOpen: false };
    case "complete":
      return { ...state, isDone: true };
  }
}
