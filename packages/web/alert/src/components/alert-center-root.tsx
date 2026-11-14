import type { AlertItem } from "../types/alert-item";
import type {
  AlertContentBase,
  MarkdownAlertContent,
} from "../types/content/alert-content";
import type {
  AlertContentComponents,
  AnyAlertContentComponents,
} from "../types/content/alert-content-components";
import { AlertMarkdownContent } from "./markdown/alert-markdown-content";
import { AlertQueue } from "./queue/alert-queue";

/** Props of the alert dialog (`AlertCenter`). */
export interface AlertCenterRootProps<
  TContent extends AlertContentBase = MarkdownAlertContent,
> {
  /** The alerts that exist. The ones already seen are skipped. `TContent` is the union of your own kinds of content. */
  alerts: AlertItem<TContent | MarkdownAlertContent>[];
  /** The component that renders each kind of content that is not built in, by its `type`. An alert whose type has no component is skipped. */
  contentComponents?: AlertContentComponents<TContent>;
  /** Where the ids of the seen alerts are kept in the browser. Use one per user. Without it they are only kept until the page closes. */
  seenStorageKey?: string;
  /** Called when an alert was seen, e.g. to tell the API. */
  onSeen?: (alert: AlertItem<TContent | MarkdownAlertContent>) => void;
}

/** Shows the alerts not seen yet in one dialog, page by page: the most important first, each only once. Place it once, high in the tree. */
export function AlertCenterRoot<
  TContent extends AlertContentBase = MarkdownAlertContent,
>({
  alerts,
  contentComponents,
  seenStorageKey,
  onSeen,
}: AlertCenterRootProps<TContent>) {
  // NOTE: the built-in type goes last, so it can't be replaced
  const components: AnyAlertContentComponents = {
    ...(contentComponents as AnyAlertContentComponents | undefined),
    markdown: AlertMarkdownContent as AnyAlertContentComponents[string],
  };

  // NOTE: a new key (another user) starts over with another set of seen alerts
  return (
    <AlertQueue
      key={seenStorageKey ?? "session"}
      alerts={alerts}
      components={components}
      seenStorageKey={seenStorageKey}
      onSeen={
        onSeen as ((alert: AlertItem<AlertContentBase>) => void) | undefined
      }
    />
  );
}
