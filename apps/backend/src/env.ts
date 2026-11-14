import { backendEnvSchema } from "@shared/env/backend";

/** The backend's env, validated once at startup. Bun loads `.env` (and `.env.test` under NODE_ENV=test) by itself. */
export const env = backendEnvSchema.parse(process.env);
