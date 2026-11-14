import type {
  AlertContentBase,
  MarkdownAlertContent,
} from "./content/alert-content";

/**
 * One alert. `TContent` is the union of the kinds of content the app uses (`MarkdownAlertContent` plus its own).
 * The `id` stays out of the content: "seen" is remembered by it, so it must not change.
 */
export interface AlertItem<
  TContent extends AlertContentBase = MarkdownAlertContent,
> {
  /** Identifies the alert. It is shown until it is seen, and "seen" is remembered by this id. */
  id: string;
  content: TContent;
}
