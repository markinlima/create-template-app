import type { ComponentType } from "react";

import type { AlertItem } from "../alert-item";
import type { AlertContentBase, MarkdownAlertContent } from "./alert-content";

/** What a component that renders a kind of content receives. */
export interface AlertContentComponentProps<TContent extends AlertContentBase> {
  alert: AlertItem<TContent>;
  /** The same as `alert.content`. */
  content: TContent;
}

/** The kinds of content that are not built in. */
export type CustomAlertContent<TContent extends AlertContentBase> = Exclude<
  TContent,
  MarkdownAlertContent
>;

/** One component per custom `type` of the union, each receiving its own content, narrowed. */
export type AlertContentComponents<TContent extends AlertContentBase> = {
  [Type in CustomAlertContent<TContent>["type"]]: ComponentType<
    AlertContentComponentProps<Extract<TContent, { type: Type }>>
  >;
};

/** The same map without the types, for the code that doesn't know the union. */
export type AnyAlertContentComponents = Record<
  string,
  ComponentType<AlertContentComponentProps<AlertContentBase>>
>;
