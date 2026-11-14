import z from "zod";

import { ref } from "../utils/ref";

export const healthModel = z
  .object({
    status: z.literal("ok"),
    uptimeInSeconds: z.number(),
  })
  .meta(ref("HealthModel"));
