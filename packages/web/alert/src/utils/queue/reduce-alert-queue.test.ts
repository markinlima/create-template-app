import { describe, expect, it } from "bun:test";

import {
  type AlertQueueState,
  initialAlertQueueState,
  reduceAlertQueue,
} from "./reduce-alert-queue";

function at(index: number, furthestIndex = index): AlertQueueState {
  return { ...initialAlertQueueState, index, furthestIndex };
}

describe("reduceAlertQueue", () => {
  it("starts at the first alert, open", () => {
    expect(initialAlertQueueState).toEqual({
      index: 0,
      furthestIndex: 0,
      isOpen: true,
      isDone: false,
    });
  });

  it("goes to the next alert and remembers how far the user got", () => {
    expect(reduceAlertQueue(at(0), { type: "next", total: 3 })).toMatchObject({
      index: 1,
      furthestIndex: 1,
      isOpen: true,
    });
  });

  it("closes at the last alert instead of going past it", () => {
    expect(reduceAlertQueue(at(2), { type: "next", total: 3 })).toMatchObject({
      index: 2,
      isOpen: false,
    });
  });

  it("closes at a lone alert", () => {
    expect(reduceAlertQueue(at(0), { type: "next", total: 1 })).toMatchObject({
      isOpen: false,
    });
  });

  it("goes back, keeping how far the user got", () => {
    expect(reduceAlertQueue(at(2), { type: "back" })).toMatchObject({
      index: 1,
      furthestIndex: 2,
    });
  });

  it("doesn't go back from the first alert", () => {
    expect(reduceAlertQueue(at(0), { type: "back" }).index).toBe(0);
  });

  it("doesn't lower how far the user got when it goes forward again after going back", () => {
    const back = reduceAlertQueue(at(2), { type: "back" });

    expect(reduceAlertQueue(back, { type: "next", total: 4 })).toMatchObject({
      index: 2,
      furthestIndex: 2,
    });
  });

  it("closes the dialog without moving", () => {
    expect(reduceAlertQueue(at(1), { type: "close" })).toMatchObject({
      index: 1,
      isOpen: false,
    });
  });

  it("is done once the dialog finished closing", () => {
    expect(reduceAlertQueue(at(0), { type: "complete" }).isDone).toBe(true);
  });
});
