import { defineHandler } from "nitro";

import { getPublicFiles } from "../lib/get-public-files";
import { buildHealthResponse } from "../utils/health/build-health-response";

/** The health check of the server (see `buildHealthResponse`). */
export default defineHandler(() => buildHealthResponse(getPublicFiles));
