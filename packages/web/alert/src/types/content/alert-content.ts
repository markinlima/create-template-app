/** The variants an alert can have, in the order of the type. */
export const alertVariants = ["update", "info", "warning"] as const;

/** What the alert is about, which decides the icon and the color of its heading. */
export type AlertVariant = (typeof alertVariants)[number];

/** The importances an alert can have, from the least to the most. */
export const alertImportances = ["low", "medium", "high"] as const;

/**
 * How much the alert needs to be read, which decides how it can be closed:
 * - `low`: it doesn't need to be read; the dialog can be closed any way (the X, a click outside, Escape or the button)
 *   while it is on the screen. The most important alerts come first, so by then the ones that had to be read are done.
 * - `medium`: it must be read, so only the button closes the dialog while it is on the screen.
 * - `high`: like `medium`, and its button waits a few seconds before it works.
 */
export type AlertImportance = (typeof alertImportances)[number];

/** What every kind of content has. The `type` says which component renders the rest of the alert. */
export interface AlertContentBase {
  /** Picks the component that renders the alert: `markdown` is built in, any other one is registered with `contentComponents`. */
  type: string;
  importance: AlertImportance;
  /** Shown in the heading of the dialog, for every type. */
  title: string;
  /** The icon and color of the heading. Defaults to `info`. */
  variant?: AlertVariant;
}

/** The built-in content: a text in markdown (text, lists, links and images; raw HTML is not rendered) and a button. */
export interface MarkdownAlertContent extends AlertContentBase {
  type: "markdown";
  body: string;
  /** Text of the button that goes to the next alert. Defaults by the place of the alert in the queue. */
  buttonLabel?: string;
  /** Seconds the button waits before it works, for the alerts that can only be closed by it. Defaults by importance. */
  cooldownSeconds?: number;
}
