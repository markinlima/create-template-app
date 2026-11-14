import { describe, expect, it } from "bun:test";

import { makeAlert } from "../../test/make-alert";
import { renderInQueue } from "../../test/render-in-queue";
import { AlertNextButton } from "./alert-next-button";

describe("AlertNextButton", () => {
  it("says it understood when the alert is alone", () => {
    const html = renderInQueue([makeAlert("a")], <AlertNextButton />);

    expect(html).toContain("Entendi");
    expect(html).not.toContain('disabled=""');
  });

  it("says next while there are more alerts to come", () => {
    const html = renderInQueue(
      [makeAlert("a"), makeAlert("b")],
      <AlertNextButton />,
    );

    expect(html).toContain("Próximo");
  });

  it("takes the text it is given over the default one", () => {
    const html = renderInQueue(
      [makeAlert("a")],
      <AlertNextButton>Concordar</AlertNextButton>,
    );

    expect(html).toContain("Concordar");
    expect(html).not.toContain("Entendi");
  });

  it("waits, disabled and counting, when the alert is high importance", () => {
    const html = renderInQueue([makeAlert("a", "high")], <AlertNextButton />);

    expect(html).toContain('disabled=""');
    expect(html).toContain("(5s)");
  });

  it("doesn't wait when the alert is only medium importance", () => {
    const html = renderInQueue([makeAlert("a", "medium")], <AlertNextButton />);

    expect(html).not.toContain('disabled=""');
  });

  it("takes the wait it is given over the one of the importance", () => {
    const html = renderInQueue(
      [makeAlert("a", "high")],
      <AlertNextButton cooldownSeconds={2} />,
    );

    expect(html).toContain("(2s)");
  });

  it("is disabled when the outside says so", () => {
    const html = renderInQueue([makeAlert("a")], <AlertNextButton disabled />);

    expect(html).toContain('disabled=""');
  });

  it("takes the props of a button", () => {
    const html = renderInQueue(
      [makeAlert("a")],
      <AlertNextButton data-testid="next" variant="secondary" />,
    );

    expect(html).toContain('data-testid="next"');
  });
});
