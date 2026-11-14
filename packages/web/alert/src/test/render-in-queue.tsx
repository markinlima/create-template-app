import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AlertQueueProvider } from "../components/queue/alert-queue-provider";
import type { AlertItem } from "../types/alert-item";
import type { AlertContentBase } from "../types/content/alert-content";

/** Renders `children` inside the alert dialog's queue, at its first alert. */
export function renderInQueue(
  alerts: AlertItem<AlertContentBase>[],
  children: ReactNode,
) {
  return renderToStaticMarkup(
    <AlertQueueProvider alerts={alerts} onSeen={() => {}}>
      {children}
    </AlertQueueProvider>,
  );
}
