import z from "zod";

/** The Umami variables of the web app. The source schema extends it; the profiles decide which of them reach the browser. */
export const umamiEnvSchema = z.object({
  // ? Umami envs for traffic analytics
  VITE_UMAMI_WEBSITE_ID: z.string().optional(),
  VITE_UMAMI_URL: z.url().optional(),
  VITE_UMAMI_TRACKER_SCRIPT_NAME: z.string().default("script.js"),
  VITE_UMAMI_COLLECT_API_ENDPOINT: z
    .string()
    .startsWith("/")
    .default("/api/send"),
});
