import z from "zod";

import { formatEnvVariables } from "../utils";
import { nodeEnv } from "../utils/node-env";
import { sentryEnvSchema } from "./sentry";
import { umamiEnvSchema } from "./umami";

const schemaServer = z
  .object({
    NODE_ENV: nodeEnv(),
  })
  .and(sentryEnvSchema.server);

const schemaClient = z
  .object({
    VITE_FRONTEND_URL: z.url(),
    VITE_WEB_VERSION: z.string().min(1),
    VITE_USER_NODE_ENV: nodeEnv(),
    VITE_API_URL: z.url(),
    VITE_API_VERSION: z.string().min(1),
    VITE_DEBUG_MODE: z.boolean().default(false),
  })
  .and(sentryEnvSchema.client)
  .and(umamiEnvSchema.client);

const formattedSchemaClient = z.preprocess(formatEnvVariables, schemaClient);
const formattedSchemaServer = z.preprocess(formatEnvVariables, schemaServer);

export const webEnvSchema = {
  server: formattedSchemaServer,
  client: formattedSchemaClient,
};
