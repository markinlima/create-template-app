import { sql } from "drizzle-orm";
import { index, snakeCase, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

/** The credential table of Better Auth: a row per sign-in method. The email and password one keeps its hash in `password`. */
export const accounts = snakeCase.table(
  "accounts",
  {
    id: text().notNull().primaryKey().default(sql`uuidv7()`),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ precision: 3 }),
    refreshTokenExpiresAt: timestamp({ precision: 3 }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp({ precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.userId)],
);

export type Account = typeof accounts.$inferSelect;
export type AccountInput = typeof accounts.$inferInsert;
