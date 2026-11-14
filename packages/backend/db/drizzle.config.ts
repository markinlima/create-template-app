import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle/migrations",
  schemaFilter: "public",
  dbCredentials: {
    // FIXME: Placeholder. Set DATABASE_URL in the environment (the backend's `.env` is loaded by `bun --env-file`).
    url:
      process.env.DATABASE_URL ??
      "postgres://postgres:postgres@localhost:5432/app",
  },
});
