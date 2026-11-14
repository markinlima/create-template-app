import { useContext } from "react";

import { AlertQueueContext } from "../../contexts/alert-queue-context";

/** The queue of the alert dialog: where the user is and how to move it. Only works inside the dialog (in the component of a content type). */
export function useAlertQueue() {
  const queue = useContext(AlertQueueContext);

  if (!queue) {
    throw new Error(
      "useAlertQueue must be used inside an alert of the AlertCenter dialog.",
    );
  }

  return queue;
}
