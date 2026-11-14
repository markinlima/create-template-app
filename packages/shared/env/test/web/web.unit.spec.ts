import { describe, expect, it } from "bun:test";

import {
  buildEnvSchema,
  clientEnvSchema,
  serverEnvSchema,
  webEnvSource,
} from "../../src/web";
import { failedKeys } from "../utils/parse";

const clientEnv = {
  VITE_FRONTEND_URL: "http://localhost:5173",
  VITE_WEB_VERSION: "1.0.0",
  VITE_API_URL: "http://localhost:3333",
  VITE_API_VERSION: "1",
};

const BUILD_ONLY_KEYS = [
  "SENTRY_AUTH_TOKEN",
  "ANALYZE_BUNDLE",
  "COMPRESS_BUNDLE",
];

describe("buildEnvSchema", () => {
  it("should accept a complete environment", () => {
    expect(failedKeys(buildEnvSchema, clientEnv)).toEqual([]);
  });

  it.each(["VITE_FRONTEND_URL", "VITE_API_URL"])("should require %s", (key) => {
    expect(
      failedKeys(buildEnvSchema, { ...clientEnv, [key]: undefined }),
    ).toEqual([key]);
  });

  it.each(["VITE_FRONTEND_URL", "VITE_API_URL"])(
    "should require %s to be a URL",
    (key) => {
      expect(
        failedKeys(buildEnvSchema, { ...clientEnv, [key]: "nope" }),
      ).toEqual([key]);
    },
  );

  it("should default the versions, which only matter in staging and production", () => {
    expect(
      buildEnvSchema.parse({
        VITE_FRONTEND_URL: clientEnv.VITE_FRONTEND_URL,
        VITE_API_URL: clientEnv.VITE_API_URL,
      }),
    ).toMatchObject({ VITE_WEB_VERSION: "0.0.0", VITE_API_VERSION: "1" });
  });

  it("should use the default version for an empty value", () => {
    expect(
      buildEnvSchema.parse({ ...clientEnv, VITE_WEB_VERSION: "" }),
    ).toMatchObject({
      VITE_WEB_VERSION: "0.0.0",
    });
  });

  it("should default VITE_USER_NODE_ENV to 'production'", () => {
    expect(buildEnvSchema.parse(clientEnv)).toMatchObject({
      VITE_USER_NODE_ENV: "production",
    });
  });

  it("should default VITE_DEBUG_MODE to false and convert 'true'", () => {
    expect(buildEnvSchema.parse(clientEnv)).toMatchObject({
      VITE_DEBUG_MODE: false,
    });
    expect(
      buildEnvSchema.parse({ ...clientEnv, VITE_DEBUG_MODE: "true" }),
    ).toMatchObject({
      VITE_DEBUG_MODE: true,
    });
  });

  it("should accept the Sentry auth token", () => {
    expect(
      buildEnvSchema.parse({ ...clientEnv, SENTRY_AUTH_TOKEN: "token" }),
    ).toMatchObject({
      SENTRY_AUTH_TOKEN: "token",
    });
  });

  it("should default ANALYZE_BUNDLE to false and convert 'true'", () => {
    expect(buildEnvSchema.parse(clientEnv)).toMatchObject({
      ANALYZE_BUNDLE: false,
    });
    expect(
      buildEnvSchema.parse({ ...clientEnv, ANALYZE_BUNDLE: "true" }),
    ).toMatchObject({
      ANALYZE_BUNDLE: true,
    });
    expect(
      buildEnvSchema.parse({ ...clientEnv, ANALYZE_BUNDLE: "" }),
    ).toMatchObject({
      ANALYZE_BUNDLE: false,
    });
  });

  it("should default COMPRESS_BUNDLE to true and convert 'false'", () => {
    expect(buildEnvSchema.parse(clientEnv)).toMatchObject({
      COMPRESS_BUNDLE: true,
    });
    expect(
      buildEnvSchema.parse({ ...clientEnv, COMPRESS_BUNDLE: "false" }),
    ).toMatchObject({
      COMPRESS_BUNDLE: false,
    });
    expect(
      buildEnvSchema.parse({ ...clientEnv, COMPRESS_BUNDLE: "" }),
    ).toMatchObject({
      COMPRESS_BUNDLE: true,
    });
  });

  it("should require VITE_SENTRY_URL to be a URL when set", () => {
    expect(
      failedKeys(buildEnvSchema, { ...clientEnv, VITE_SENTRY_URL: "nope" }),
    ).toEqual(["VITE_SENTRY_URL"]);
  });

  it("should accept an empty Sentry and Umami configuration", () => {
    expect(failedKeys(buildEnvSchema, clientEnv)).toEqual([]);
  });

  it("should treat an empty VITE_UMAMI_URL as not set", () => {
    expect(
      failedKeys(buildEnvSchema, { ...clientEnv, VITE_UMAMI_URL: "" }),
    ).toEqual([]);
  });

  it("should default the tracker script and the collect endpoint to the Umami ones", () => {
    expect(buildEnvSchema.parse(clientEnv)).toMatchObject({
      VITE_UMAMI_TRACKER_SCRIPT_NAME: "script.js",
      VITE_UMAMI_COLLECT_API_ENDPOINT: "/api/send",
    });
  });

  it("should require the collect endpoint to be a path", () => {
    expect(
      failedKeys(buildEnvSchema, {
        ...clientEnv,
        VITE_UMAMI_COLLECT_API_ENDPOINT: "api/send",
      }),
    ).toEqual(["VITE_UMAMI_COLLECT_API_ENDPOINT"]);
  });
});

describe("clientEnvSchema", () => {
  it("should accept the public variables", () => {
    expect(failedKeys(clientEnvSchema, clientEnv)).toEqual([]);
  });

  it("should require VITE_API_URL", () => {
    expect(
      failedKeys(clientEnvSchema, { ...clientEnv, VITE_API_URL: undefined }),
    ).toEqual(["VITE_API_URL"]);
  });

  it("should keep the defaults and conversions of the source", () => {
    expect(
      clientEnvSchema.parse({ ...clientEnv, VITE_DEBUG_MODE: "true" }),
    ).toMatchObject({
      VITE_DEBUG_MODE: true,
      VITE_USER_NODE_ENV: "production",
      VITE_UMAMI_COLLECT_API_ENDPOINT: "/api/send",
    });
  });

  it("should leave out every build-only variable", () => {
    const parsed = clientEnvSchema.parse({
      ...clientEnv,
      SENTRY_AUTH_TOKEN: "token",
      ANALYZE_BUNDLE: "true",
    });

    for (const key of BUILD_ONLY_KEYS) {
      expect(parsed).not.toHaveProperty(key);
    }
  });
});

describe("serverEnvSchema", () => {
  it("should have the same variables as the client, and none of the build-only ones", () => {
    const input = {
      ...clientEnv,
      VITE_SENTRY_DSN: "https://sentry.example/1",
      SENTRY_AUTH_TOKEN: "token",
    };

    expect(Object.keys(serverEnvSchema.parse(input)).sort()).toEqual(
      Object.keys(clientEnvSchema.parse(input)).sort(),
    );
    expect(serverEnvSchema.parse(input)).not.toHaveProperty(
      "SENTRY_AUTH_TOKEN",
    );
  });
});

describe("the public picks", () => {
  const publicKeys = Object.keys(webEnvSource.shape)
    .filter((key) => key.startsWith("VITE_"))
    .sort();

  it.each([
    ["client", clientEnvSchema],
    ["server", serverEnvSchema],
  ])(
    "should list every VITE_ variable of the source in the %s schema",
    (_name, schema) => {
      expect(Object.keys(schema.out.shape).sort()).toEqual(publicKeys);
    },
  );
});

describe("VITE_BUILD_ID", () => {
  it("should be optional in the build schema", () => {
    expect(failedKeys(buildEnvSchema, clientEnv)).toEqual([]);
  });

  it("should reach the client and the server when it is set", () => {
    expect(
      clientEnvSchema.parse({ ...clientEnv, VITE_BUILD_ID: "123" }),
    ).toMatchObject({ VITE_BUILD_ID: "123" });
    expect(
      serverEnvSchema.parse({ ...clientEnv, VITE_BUILD_ID: "123" }),
    ).toMatchObject({ VITE_BUILD_ID: "123" });
  });

  it("should treat an empty value as not set", () => {
    expect(
      clientEnvSchema.parse({ ...clientEnv, VITE_BUILD_ID: "" }).VITE_BUILD_ID,
    ).toBeUndefined();
  });
});
