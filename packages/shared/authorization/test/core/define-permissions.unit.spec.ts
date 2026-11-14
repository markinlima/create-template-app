import { describe, expect, it } from "bun:test";

import { configureAbility } from "../../src";

const { defineAbilityFor } = configureAbility();

const user = {
  id: "user-1",
  name: "User",
  email: "user@example.com",
  username: null,
  image: null,
  role: "user",
};

describe("defineAbilityFor", () => {
  it("should not grant anything to a user with an unverified e-mail", () => {
    const { can } = defineAbilityFor({
      user: { ...user, emailVerified: false },
    });

    expect(can("manage", "all")).toBe(false);
  });

  it("should grant nothing by default to a verified user", () => {
    const { can } = defineAbilityFor({
      user: { ...user, emailVerified: true },
    });

    expect(can("manage", "all")).toBe(false);
  });
});
