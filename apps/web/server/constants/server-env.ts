import type { z } from "zod";

import type { serverEnvSchema } from "@shared/env/web";
import { getServerEnv } from "@web/server/config";

/** The envs of the server bundle: the public `VITE_*` ones of `serverEnvSchema`, the only ones `vite.config.ts` copies into it. */
export type ServerEnv = z.output<typeof serverEnvSchema>;

/**
 * The envs of the server code (`server/`), the counterpart of `clientEnv` in the app, with the same names. They are the public `VITE_*` values
 * the build already put in the bundle, copied into the server bundle by `webServer({ env })` in `vite.config.ts` when it is built: the container needs
 * no env of its own for them and holds nothing sensitive. The envs that change per environment (`VITE_UMAMI_URL`) are read from `process.env`
 * when the server starts.
 */
export const serverEnv = getServerEnv<ServerEnv>();
