import z from "zod";

import { formatEnvVariables } from "../utils";

const schemaClient = z.object({
  // ? Umami envs para análises de tráfego
  VITE_UMAMI_WEBSITE_ID: z.string().optional(),
  VITE_UMAMI_URL: z.url().optional(),
});

const formattedSchemaClient = z.preprocess(formatEnvVariables, schemaClient);

export const umamiEnvSchema = {
  client: formattedSchemaClient,
};
