import z from "zod";

import { ref } from "../utils/ref";

/** The body of every error response (see `errorHandler` in the backend). `code` is an optional machine-readable reason, e.g. `auth.email_not_verified`. */
export const errorModel = z
  .object({
    statusCode: z.number(),
    message: z.string(),
    retryable: z.boolean(),
    errors: z.string().optional(),
    code: z.string().optional(),
  })
  .meta(ref("ErrorModel"));

export type ErrorModel = z.infer<typeof errorModel>;
export type ErrorModelInput = z.input<typeof errorModel>;
