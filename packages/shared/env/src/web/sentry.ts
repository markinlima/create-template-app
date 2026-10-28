import z from "zod";

import { formatEnvVariables } from "../utils";

const schemaClient = z.object({
  // ? Sentry envs para relatórios de erros
  VITE_SENTRY_DSN: z.url().optional(),
  VITE_SENTRY_URL: z.url().optional(),
  VITE_SENTRY_ORG: z.string().optional(),
  VITE_SENTRY_PROJECT: z.string().optional(),
});

const schemaServer = z.object({
  /** para enviar o source map para o sentry  */
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

const formattedSchemaClient = z.preprocess(formatEnvVariables, schemaClient);
const formattedSchemaServer = z.preprocess(formatEnvVariables, schemaServer);

export const sentryEnvSchema = {
  server: formattedSchemaServer,
  client: formattedSchemaClient,
};
