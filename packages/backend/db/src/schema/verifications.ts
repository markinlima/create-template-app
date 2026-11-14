import { sql } from "drizzle-orm";
import { index, snakeCase, text, timestamp } from "drizzle-orm/pg-core";

/** The short-lived codes of Better Auth (the e-mail OTP): `identifier` is the e-mail (with the purpose), `value` the hashed code. */
export const verifications = snakeCase.table(
  "verifications",
  {
    id: text().notNull().primaryKey().default(sql`uuidv7()`),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ precision: 3 }).notNull(),
    createdAt: timestamp({ precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp({ precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.identifier)],
);

export type Verification = typeof verifications.$inferSelect;
export type VerificationInput = typeof verifications.$inferInsert;
