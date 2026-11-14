import z from "zod";

import { healthModel } from "../../../models";

export const getHealthResponse = z.object({
  health: healthModel,
});

export type GetHealthResponse = z.infer<typeof getHealthResponse>;
