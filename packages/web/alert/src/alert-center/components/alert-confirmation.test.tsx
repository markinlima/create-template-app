import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AlertConfirmation } from "./alert-confirmation";

function render(isChecked: boolean) {
  return renderToStaticMarkup(
    <AlertConfirmation
      label="Li e concordo com as regras"
      isChecked={isChecked}
      onCheckedChange={() => undefined}
    />,
  );
}

describe("AlertConfirmation", () => {
  it("shows the text next to a checkbox", () => {
    const html = render(false);

    expect(html).toContain("Li e concordo com as regras");
    expect(html).toContain('role="checkbox"');
  });

  it("shows it unchecked", () => {
    expect(render(false)).toContain('aria-checked="false"');
  });

  it("shows it checked", () => {
    expect(render(true)).toContain('aria-checked="true"');
  });
});
