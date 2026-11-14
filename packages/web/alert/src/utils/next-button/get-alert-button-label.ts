import {
  DEFAULT_BUTTON_LABEL,
  FINISH_BUTTON_LABEL,
  NEXT_BUTTON_LABEL,
} from "../../constants/alert-button-labels";

/** Options of {@link getAlertButtonLabel}. */
export interface GetAlertButtonLabelOptions {
  isLast: boolean;
  /** There is more than one alert in the dialog. */
  hasSeveral: boolean;
}

/** The text of the button that goes to the next alert: it says if there is more to come. */
export function getAlertButtonLabel({
  isLast,
  hasSeveral,
}: GetAlertButtonLabelOptions) {
  if (!isLast) {
    return NEXT_BUTTON_LABEL;
  }

  return hasSeveral ? FINISH_BUTTON_LABEL : DEFAULT_BUTTON_LABEL;
}
