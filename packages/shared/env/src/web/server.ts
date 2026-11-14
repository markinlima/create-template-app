import z from "zod";

import { formatEnvVariables } from "../utils";
import { webEnvSource } from "./source";

/** The variables the server bundle gets: only the public `VITE_` ones, never a build-only secret. A new `VITE_` variable is added here by hand. */
export const serverEnvSchema = z.preprocess(
  formatEnvVariables,
  webEnvSource.pick({
    VITE_FRONTEND_URL: true,
    VITE_WEB_VERSION: true,
    VITE_USER_NODE_ENV: true,
    VITE_API_URL: true,
    VITE_API_VERSION: true,
    VITE_DEBUG_MODE: true,
    VITE_BUILD_ID: true,
    VITE_SENTRY_DSN: true,
    VITE_SENTRY_URL: true,
    VITE_SENTRY_ORG: true,
    VITE_SENTRY_PROJECT: true,
    VITE_UMAMI_WEBSITE_ID: true,
    VITE_UMAMI_URL: true,
    VITE_UMAMI_TRACKER_SCRIPT_NAME: true,
    VITE_UMAMI_COLLECT_API_ENDPOINT: true,
  }),
);
