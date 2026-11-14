import { sql } from "drizzle-orm";
import { index, snakeCase, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

/** The session table of Better Auth. The cookie holds `token`; a revoked session is a deleted row. */
export const sessions = snakeCase.table(
  "sessions",
  {
    id: text().notNull().primaryKey().default(sql`uuidv7()`),
    expiresAt: timestamp({ precision: 3 }).notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp({ precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp({ precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [index().on(t.userId)],
);

export type Session = typeof sessions.$inferSelect;
export type SessionInput = typeof sessions.$inferInsert;
