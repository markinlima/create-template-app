import z from "zod";

import { ref } from "../utils/ref";

/** The public shape of a user. Never the password hash or the internal columns: the backend maps the row to this (see `mappers/user.ts`). */
export const userModel = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
    username: z.string().nullable(),
    image: z.string().nullable(),
    role: z.string(),
  })
  .meta(ref("UserModel"));

export const sessionModel = z
  .object({
    id: z.string(),
    expiresAt: z.iso.datetime(),
  })
  .meta(ref("SessionModel"));

export type UserModel = z.infer<typeof userModel>;
export type SessionModel = z.infer<typeof sessionModel>;
