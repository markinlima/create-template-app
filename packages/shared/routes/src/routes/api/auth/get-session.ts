import z from "zod";

import { sessionModel, userModel } from "../../../models";

/** `null` when there is no valid session cookie, so the client can tell "signed out" from an error. */
export const getSessionResponse = z.object({
  session: z
    .object({
      user: userModel,
      session: sessionModel,
    })
    .nullable(),
});

export type GetSessionResponse = z.infer<typeof getSessionResponse>;
