import {
  DEFAULT_BUTTON_LABEL,
  FINISH_BUTTON_LABEL,
  NEXT_BUTTON_LABEL,
} from "../constants/alert-button-labels";
import type { AlertItem } from "../types/alert-item";

export interface GetAlertButtonLabelOptions {
  alert: Pick<AlertItem, "buttonLabel">;
  isLast: boolean;
  /** There is more than one alert in the dialog. */
  hasSeveral: boolean;
}

/** The text of the button: the one the alert asks for, or one that says if there is more to come. */
export function getAlertButtonLabel({
  alert,
  isLast,
  hasSeveral,
}: GetAlertButtonLabelOptions) {
  if (alert.buttonLabel) {
    return alert.buttonLabel;
  }

  if (!isLast) {
    return NEXT_BUTTON_LABEL;
  }

  return hasSeveral ? FINISH_BUTTON_LABEL : DEFAULT_BUTTON_LABEL;
}
