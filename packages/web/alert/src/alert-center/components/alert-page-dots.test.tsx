import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AlertPageDots } from "./alert-page-dots";

describe("AlertPageDots", () => {
  it("shows nothing for a single alert", () => {
    expect(
      renderToStaticMarkup(<AlertPageDots alertIds={["a"]} currentIndex={0} />),
    ).toBe("");
  });

  it("shows one dot per alert", () => {
    const html = renderToStaticMarkup(
      <AlertPageDots alertIds={["a", "b", "c"]} currentIndex={0} />,
    );

    expect(html.match(/<span/g)).toHaveLength(3);
  });

  it("marks only the current alert", () => {
    const html = renderToStaticMarkup(
      <AlertPageDots alertIds={["a", "b", "c"]} currentIndex={1} />,
    );

    expect(html.match(/bg-primary/g)).toHaveLength(1);
    expect(html.match(/bg-muted-foreground\/30/g)).toHaveLength(2);
  });

  it("says where the user is for those who can't see the dots", () => {
    const html = renderToStaticMarkup(
      <AlertPageDots alertIds={["a", "b", "c"]} currentIndex={1} />,
    );

    expect(html).toContain('aria-label="Aviso 2 de 3"');
  });
});
