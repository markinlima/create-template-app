export const alertTypes = ["update", "info", "warning", "punishment"] as const;

/** What the alert is about, which decides its icon and color. */
export type AlertType = (typeof alertTypes)[number];

export const alertImportances = ["low", "high", "critical"] as const;

/**
 * How much the alert needs to be read, which decides how it can be closed:
 * - `low`: it doesn't need to be read; the dialog can be closed any way (the X, a click outside, Escape or the button)
 *   while it is on the screen. The most important alerts come first, so by then the ones that had to be read are done.
 * - `high`: it must be read, so only the button closes the dialog while it is on the screen.
 * - `critical`: like `high`, and its button waits a few seconds before it works.
 */
export type AlertImportance = (typeof alertImportances)[number];

export interface AlertItem {
  /** Identifies the alert. It is shown until it is seen, and "seen" is remembered by this id, so it must not change. */
  id: string;
  type: AlertType;
  importance: AlertImportance;
  title: string;
  /** Markdown: text, lists, links and images. Raw HTML is not rendered. */
  body: string;
  /** Text of the button that closes the alert. Defaults to "Entendi". */
  buttonLabel?: string;
  /** When set, a checkbox with this text is shown above the button, and the button only works while it is checked. */
  confirmationLabel?: string;
  /** Seconds the button waits before it works, for the alerts that can only be closed by it. Defaults by importance. */
  cooldownSeconds?: number;
}
