import { webEnvSchema } from "@shared/env/web";

export const serverEnv = webEnvSchema.server.parse(process.env);
