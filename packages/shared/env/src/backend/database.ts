import z from "zod";

import { formatEnvVariables } from "../utils";

const schema = z.object({
  DATABASE_URL: z.url(),
});

const formattedSchema = z.preprocess(formatEnvVariables, schema);
export const databaseEnvSchema = formattedSchema;
