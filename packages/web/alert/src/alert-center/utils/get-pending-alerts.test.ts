import { describe, expect, it } from "vitest";

import type { AlertImportance, AlertItem } from "../types/alert-item";
import { getPendingAlerts } from "./get-pending-alerts";

function makeAlert(id: string, importance: AlertImportance = "low"): AlertItem {
  return { id, type: "info", importance, title: id, body: id };
}

function ids(alerts: AlertItem[]) {
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
      makeAlert("critical", "critical"),
      makeAlert("high", "high"),
    ];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set() }))).toEqual([
      "critical",
      "high",
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
    const alerts = [makeAlert("low", "low"), makeAlert("critical", "critical")];

    getPendingAlerts({ alerts, seenIds: new Set() });

    expect(ids(alerts)).toEqual(["low", "critical"]);
  });

  it("shows an id that appears twice once", () => {
    const alerts = [makeAlert("a"), makeAlert("a"), makeAlert("b")];

    expect(ids(getPendingAlerts({ alerts, seenIds: new Set() }))).toEqual([
      "a",
      "b",
    ]);
  });
});
