import { z } from "zod";

/**
 * What every update file carries: the id of the build that wrote it. The rest is up to the app, so other fields are kept (`looseObject`);
 * an app that adds fields to the file extends this schema and gives the result to `createUpdateChecker`.
 */
export const updateFileSchema = z.looseObject({ buildId: z.string().min(1) });

export type UpdateFileData = z.infer<typeof updateFileSchema>;
