import { useAlertQueue } from "../../hooks/queue/use-alert-queue";
import {
  AlertNextButtonBody,
  type AlertNextButtonBodyProps,
} from "./alert-next-button-body";

/** Props of `AlertCenter.nextButton`. */
export type AlertNextButtonProps = AlertNextButtonBodyProps;

/**
 * The button that goes to the next alert (and closes the dialog at the last one). It takes every prop of a `Button`.
 * It waits before it works by the importance of the alert (or `cooldownSeconds`), and while `disabled` is true.
 * `onClick` runs first; call `event.preventDefault()` in it to take the advance yourself (`useAlertQueue().next()`). Needs the alert dialog.
 */
export function AlertNextButton(props: AlertNextButtonProps) {
  const { current } = useAlertQueue();

  // NOTE: mounted again per alert, so the wait starts again.
  return <AlertNextButtonBody key={current.id} {...props} />;
}
