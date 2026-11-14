import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  snakeCase,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** The user table of Better Auth (`usePlural`), plus `username` (Better Auth's username plugin) and `role`. */
export const users = snakeCase.table(
  "users",
  {
    id: text().notNull().primaryKey().default(sql`uuidv7()`),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().notNull().default(false),
    image: text(),
    username: varchar({ length: 255 }).unique(),
    displayUsername: text(),
    role: text().notNull().default("user"),
    createdAt: timestamp({ precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp({ precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.name)],
);

export type User = typeof users.$inferSelect;
export type UserInput = typeof users.$inferInsert;
