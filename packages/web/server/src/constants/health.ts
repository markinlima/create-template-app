/** The address the health check asks. The script in `scripts/health-check.ts` has it written too, because it runs alone, with no imports. */
export const HEALTH_PATH = "/healthz";

/** The name of the health-check script in the output folder, the one the `HEALTHCHECK` of the image runs. */
export const HEALTH_SCRIPT_NAME = "health-check.ts";
