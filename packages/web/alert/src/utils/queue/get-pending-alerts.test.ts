import { describe, expect, it } from "bun:test";

import type { AlertItem } from "../../types/alert-item";
import type {
  AlertContentBase,
  AlertImportance,
} from "../../types/content/alert-content";
import { getPendingAlerts } from "./get-pending-alerts";

function makeAlert(
  id: string,
  importance: AlertImportance = "low",
  type = "markdown",
): AlertItem<AlertContentBase> {
  return { id, content: { type, importance, title: id } };
}

function ids(alerts: AlertItem<AlertContentBase>[]) {
  return alerts.map(({ id }) => id);
}

describe("getPendingAlerts", () => {
  it("returns nothing when there are no alerts", () => {
    expect(getPendingAlerts({ alerts: [], seenIds: new Set() })).toEqual([]);
  });

  it("skips the alerts already seen", () => {
    const alerts = [makeAlert("a"), makeAlert("b"), makeAlert("c")];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set(["b"]) }))).toEqual([
      "a",
      "c",
    ]);
  });

  it("returns nothing once every alert was seen", () => {
    const alerts = [makeAlert("a"), makeAlert("b")];

    expect(getPendingAlerts({ alerts, seenIds: new Set(["a", "b"]) })).toEqual(
      [],
    );
  });

  it("puts the most important alerts first, whatever the order of the list", () => {
    const alerts = [
      makeAlert("low", "low"),
      makeAlert("high", "high"),
      makeAlert("medium", "medium"),
    ];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set() }))).toEqual([
      "high",
      "medium",
      "low",
    ]);
  });

  it("keeps the order of the list among alerts that are equally important", () => {
    const alerts = [
      makeAlert("first"),
      makeAlert("second"),
      makeAlert("third"),
    ];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set() }))).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("doesn't change the list it was given", () => {
    const alerts = [makeAlert("low", "low"), makeAlert("high", "high")];

    getPendingAlerts({ alerts, seenIds: new Set() });

    expect(ids(alerts)).toEqual(["low", "high"]);
  });

  it("shows an id that appears twice once", () => {
    const alerts = [makeAlert("a"), makeAlert("a"), makeAlert("b")];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set() }))).toEqual([
      "a",
      "b",
    ]);
  });

  it("skips the alerts of a type that nothing can render, when told which types can", () => {
    const alerts = [
      makeAlert("a", "low", "markdown"),
      makeAlert("b", "low", "unknown"),
      makeAlert("c", "low", "terms-form"),
    ];

    expect(
      ids(
        getPendingAlerts({
          alerts,
          seenIds: new Set(),
          renderableTypes: ["markdown", "terms-form"],
        }),
      ),
    ).toEqual(["a", "c"]);
  });
});
