import { AlertCenterRoot } from "./components/alert-center-root";
import { AlertBackButton } from "./components/controls/alert-back-button";
import { AlertBody } from "./components/controls/alert-body";
import { AlertFooter } from "./components/controls/alert-footer";
import { AlertQueueDots } from "./components/controls/alert-queue-dots";
import { AlertNextButton } from "./components/next-button/alert-next-button";

/**
 * The alert dialog, placed once high in the tree, with the parts that a content type component uses.
 *
 * @remarks
 * The parts read the queue the dialog shares, so they work only inside the component of a content type.
 */
export const AlertCenter = Object.assign(AlertCenterRoot, {
  body: AlertBody,
  footer: AlertFooter,
  nextButton: AlertNextButton,
  backButton: AlertBackButton,
  dots: AlertQueueDots,
});
