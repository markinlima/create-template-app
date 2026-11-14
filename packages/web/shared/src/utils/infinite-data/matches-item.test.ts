import { describe, expect, it } from "bun:test";

import { matchesItem } from "./matches-item";

describe("matchesItem", () => {
  it("gives what the condition says", () => {
    expect(
      matchesItem<{ id: string }>((item) => item.id === "a", { id: "a" }),
    ).toBe(true);
    expect(
      matchesItem<{ id: string }>((item) => item.id === "a", { id: "b" }),
    ).toBe(false);
  });

  it("does not match an item the condition can't read", () => {
    expect(
      matchesItem<{ user: { id: string } }>(({ user }) => user.id === "a", {
        followerCount: 1,
      }),
    ).toBe(false);
  });
});
