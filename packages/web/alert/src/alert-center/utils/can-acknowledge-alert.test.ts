import { describe, expect, it } from "vitest";

import { canAcknowledgeAlert } from "./can-acknowledge-alert";

describe("canAcknowledgeAlert", () => {
  it("works when there is nothing to wait for and nothing to check", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 0,
        requiresConfirmation: false,
        isConfirmed: false,
      }),
    ).toBe(true);
  });

  it("doesn't work while the wait is not over", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 3,
        requiresConfirmation: false,
        isConfirmed: false,
      }),
    ).toBe(false);
  });

  it("doesn't work while the checkbox the alert asks for is not checked", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 0,
        requiresConfirmation: true,
        isConfirmed: false,
      }),
    ).toBe(false);
  });

  it("works once the checkbox is checked", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 0,
        requiresConfirmation: true,
        isConfirmed: true,
      }),
    ).toBe(true);
  });

  it("needs both the wait to be over and the checkbox to be checked", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 2,
        requiresConfirmation: true,
        isConfirmed: true,
      }),
    ).toBe(false);
  });

  it("ignores the checkbox when the alert doesn't ask for it", () => {
    expect(
      canAcknowledgeAlert({
        remainingSeconds: 0,
        requiresConfirmation: false,
        isConfirmed: true,
      }),
    ).toBe(true);
  });
});
