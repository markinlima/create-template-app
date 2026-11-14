import z from "zod";

import { formatEnvVariables } from "../utils";

// NOTE: connection only; each app names its own buckets
const schema = z.object({
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_REGION: z.string(),
  S3_ENDPOINT: z.string(),
});

const formattedSchema = z.preprocess(formatEnvVariables, schema);
export const storageEnvSchema = formattedSchema;
