import { describe, expect, it } from "bun:test";

import { backendEnvSchema } from "../../src/backend";
import { databaseEnv } from "../utils/fixtures";
import { failedKeys } from "../utils/parse";

const ownEnv = {
  CORS_ORIGIN: "http://localhost:5173",
  BETTER_AUTH_SECRET: "a".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3333",
};

const env = {
  ...databaseEnv,
  ...ownEnv,
  NODE_ENV: "test",
};

describe("backendEnvSchema", () => {
  it("should accept a complete environment", () => {
    expect(failedKeys(backendEnvSchema, env)).toEqual([]);
  });

  it.each(["DATABASE_URL", ...Object.keys(ownEnv)])(
    "should require %s",
    (key) => {
      expect(
        failedKeys(backendEnvSchema, { ...env, [key]: undefined }),
      ).toEqual([key]);
    },
  );

  describe("defaults", () => {
    const parsed = backendEnvSchema.parse(env);

    it("should default IS_DEPLOYED to false", () => {
      expect(parsed).toMatchObject({ IS_DEPLOYED: false });
    });

    it("should default RUN_MIGRATIONS to false", () => {
      expect(parsed).toMatchObject({ RUN_MIGRATIONS: false });
    });

    it("should default PORT to 3333", () => {
      expect(parsed).toMatchObject({ PORT: 3333 });
    });
  });

  it("should coerce PORT to a number", () => {
    expect(backendEnvSchema.parse({ ...env, PORT: "4000" })).toMatchObject({
      PORT: 4000,
    });
  });

  it("should convert boolean strings", () => {
    expect(
      backendEnvSchema.parse({
        ...env,
        IS_DEPLOYED: "true",
        RUN_MIGRATIONS: "true",
      }),
    ).toMatchObject({ IS_DEPLOYED: true, RUN_MIGRATIONS: true });
  });

  describe("CORS_ORIGIN", () => {
    it("should be split by comma into a list of URLs", () => {
      const parsed = backendEnvSchema.parse({
        ...env,
        CORS_ORIGIN: "http://localhost:5173,https://app.example.com",
      });

      expect(parsed).toMatchObject({
        CORS_ORIGIN: ["http://localhost:5173", "https://app.example.com"],
      });
    });

    it("should reject an entry that is not a URL", () => {
      expect(
        failedKeys(backendEnvSchema, {
          ...env,
          CORS_ORIGIN: "http://localhost:5173,nope",
        }),
      ).toEqual(["CORS_ORIGIN.1"]);
    });
  });

  describe("BETTER_AUTH_SECRET", () => {
    it("should require at least 32 characters", () => {
      expect(
        failedKeys(backendEnvSchema, {
          ...env,
          BETTER_AUTH_SECRET: "a".repeat(31),
        }),
      ).toEqual(["BETTER_AUTH_SECRET"]);
    });
  });

  describe("observability", () => {
    it("should not require Sentry", () => {
      expect(failedKeys(backendEnvSchema, env)).toEqual([]);
    });

    it("should require SENTRY_DSN to be a URL when set", () => {
      expect(
        failedKeys(backendEnvSchema, { ...env, SENTRY_DSN: "nope" }),
      ).toEqual(["SENTRY_DSN"]);
    });
  });
});
