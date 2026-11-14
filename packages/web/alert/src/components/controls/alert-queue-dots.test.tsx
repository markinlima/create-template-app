import { describe, expect, it } from "bun:test";

import { makeAlert } from "../../test/make-alert";
import { renderInQueue } from "../../test/render-in-queue";
import { AlertQueueDots } from "./alert-queue-dots";

describe("AlertQueueDots", () => {
  it("shows nothing for a single alert", () => {
    expect(renderInQueue([makeAlert("a")], <AlertQueueDots />)).toBe("");
  });

  it("shows one dot per alert", () => {
    const html = renderInQueue(
      [makeAlert("a"), makeAlert("b"), makeAlert("c")],
      <AlertQueueDots />,
    );

    expect(html.match(/<span/g)).toHaveLength(3);
  });

  it("marks only the current alert", () => {
    const html = renderInQueue(
      [makeAlert("a"), makeAlert("b"), makeAlert("c")],
      <AlertQueueDots />,
    );

    expect(html.match(/bg-primary/g)).toHaveLength(1);
    expect(html.match(/bg-muted-foreground\/30/g)).toHaveLength(2);
  });

  it("says where the user is for those who can't see the dots", () => {
    const html = renderInQueue(
      [makeAlert("a"), makeAlert("b"), makeAlert("c")],
      <AlertQueueDots />,
    );

    expect(html).toContain('aria-label="Aviso 1 de 3"');
  });

  it("takes the props of a div", () => {
    const html = renderInQueue(
      [makeAlert("a"), makeAlert("b")],
      <AlertQueueDots data-testid="dots" className="mt-2" />,
    );

    expect(html).toContain('data-testid="dots"');
    expect(html).toContain("mt-2");
  });
});
