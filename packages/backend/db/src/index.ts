import { drizzle } from "drizzle-orm/bun-sql";

/**
 * The database client, over Bun's native SQL driver (`drizzle-orm/bun-sql`).
 * The URL is read when the module loads, so a process must have `DATABASE_URL` set before importing it.
 */
export function createDb(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined.");
  }

  return drizzle(databaseUrl);
}

export const db = createDb();

export type Database = typeof db;
