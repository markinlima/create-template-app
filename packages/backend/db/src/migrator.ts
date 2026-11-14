import { migrate } from "drizzle-orm/bun-sql/migrator";

import { db } from "./index";

/** Applies the migrations of `drizzle/migrations` that the database does not have yet. Run it before the app listens. */
export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: new URL("../drizzle/migrations", import.meta.url)
      .pathname,
  });
}
