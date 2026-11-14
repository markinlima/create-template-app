import { z } from "zod";

import { pageSeoSchema } from "../../schemas/page-seo";

/** The part of the `staticData` of a route this build reads. Other keys are allowed and ignored. */
export const staticDataSchema = z.looseObject({
  prerender: z.boolean().optional(),
  seo: pageSeoSchema.optional(),
});
