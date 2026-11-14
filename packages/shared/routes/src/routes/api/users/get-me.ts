import z from "zod";

import { userModel } from "../../../models";

export const getMeResponse = z.object({
  user: userModel,
});

export type GetMeResponse = z.infer<typeof getMeResponse>;
