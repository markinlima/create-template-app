import { defineHandler } from "nitro";

import { getResolvedConfig } from "../lib/get-resolved-config";

/**
 * The security headers of the answers that are errors (a 404, a 405, a 500). The answers below 400 carry them already: they are part of
 * every file variant (see `getPublicFiles`). They are not set in `res.headers` on purpose: h3 would then rebuild every response to merge
 * them, which cost about a seventh of the throughput in the benchmark. h3 only uses `res.errHeaders` for answers of 400 and above.
 */
export default defineHandler((event) => {
  for (const [name, value] of Object.entries(
    getResolvedConfig().securityHeaders,
  )) {
    event.res.errHeaders.set(name, value);
  }
});
