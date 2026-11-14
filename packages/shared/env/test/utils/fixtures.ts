/** Minimal valid environments, one per schema. Spread and override in specs. */

export const databaseEnv = {
  DATABASE_URL: "postgres://user:pass@localhost:5432/db",
};

export const storageEnv = {
  S3_ACCESS_KEY_ID: "key",
  S3_SECRET_ACCESS_KEY: "secret",
  S3_REGION: "us-east-1",
  S3_ENDPOINT: "http://localhost:9090",
};
