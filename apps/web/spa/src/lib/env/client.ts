import { webEnvSchema } from "@shared/env/web";

export const clientEnv = webEnvSchema.client.parse(import.meta.env);
