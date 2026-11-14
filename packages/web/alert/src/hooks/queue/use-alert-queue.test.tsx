import { describe, expect, it } from "bun:test";

import { renderToStaticMarkup } from "react-dom/server";

import { makeAlert } from "../../test/make-alert";
import { renderInQueue } from "../../test/render-in-queue";
import { useAlertQueue } from "./use-alert-queue";

function Probe() {
  const queue = useAlertQueue();

  return (
    <p>
      {JSON.stringify({
        id: queue.current.id,
        index: queue.index,
        total: queue.total,
        hasSeveral: queue.hasSeveral,
        isFirst: queue.isFirst,
        isLast: queue.isLast,
        isRevisit: queue.isRevisit,
        canDismiss: queue.canDismiss,
      })}
    </p>
  );
}

function read(html: string) {
  const text = html.replace(/<[^>]+>/g, "").replaceAll("&quot;", '"');

  return JSON.parse(text);
}

describe("useAlertQueue", () => {
  it("tells where the queue is at the first alert", () => {
    const html = renderInQueue(
      [makeAlert("a", "medium"), makeAlert("b")],
      <Probe />,
    );

    expect(read(html)).toEqual({
      id: "a",
      index: 0,
      total: 2,
      hasSeveral: true,
      isFirst: true,
      isLast: false,
      isRevisit: false,
      canDismiss: false,
    });
  });

  it("lets a low importance alert be dismissed, and a lone alert be the last", () => {
    expect(
      read(renderInQueue([makeAlert("a", "low")], <Probe />)),
    ).toMatchObject({ hasSeveral: false, isLast: true, canDismiss: true });
  });

  it("can't be used outside the alert dialog", () => {
    expect(() => renderToStaticMarkup(<Probe />)).toThrow(
      "useAlertQueue must be used inside",
    );
  });
});
