import z from "zod";

import { nodeEnv } from "../utils/node-env";
import { sentryEnvSchema } from "./components/sentry";
import { umamiEnvSchema } from "./components/umami";

/**
 * Every variable of the web app: the source of truth. The build, client and server schemas are derived from it, so a variable is
 * declared once. Its prefix decides where it can be read: `VITE_` ones reach the browser and the server bundle, the others are build only.
 */
export const webEnvSource = z
  .object({
    VITE_FRONTEND_URL: z.url(),
    VITE_WEB_VERSION: z.string().min(1).default("0.0.0"),
    VITE_USER_NODE_ENV: nodeEnv(),
    VITE_API_URL: z.url(),
    VITE_API_VERSION: z.string().min(1).default("1"),
    VITE_DEBUG_MODE: z.boolean().default(false),
    /** The id of the build, written by the Vite config (the update checker reads it). Optional: it is only set in a build. */
    VITE_BUILD_ID: z.string().min(1).optional(),
    /** Build only: writes the bundle report (it makes the build much slower). */
    ANALYZE_BUNDLE: z.boolean().default(false),
    /** Build only: writes the gzip and brotli copies of the build next to its files (they take most of the time of a build). */
    COMPRESS_BUNDLE: z.boolean().default(true),
  })
  .extend(sentryEnvSchema.shape)
  .extend(umamiEnvSchema.shape);
