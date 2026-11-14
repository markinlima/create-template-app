import z from "zod";

/** The Sentry variables of the web app. The source schema extends it; the profiles decide which of them reach the browser. */
export const sentryEnvSchema = z.object({
  // ? Sentry envs for error reports
  VITE_SENTRY_DSN: z.url().optional(),
  VITE_SENTRY_URL: z.url().optional(),
  VITE_SENTRY_ORG: z.string().optional(),
  VITE_SENTRY_PROJECT: z.string().optional(),
  /** Build only (Vite does not expose it to the browser): to upload the source maps to Sentry */
  SENTRY_AUTH_TOKEN: z.string().optional(),
});
