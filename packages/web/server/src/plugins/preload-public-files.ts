import { definePlugin } from "nitro";

import { getPublicFiles } from "../lib/get-public-files";

/** Starts reading the build as soon as the server starts, so the first request does not wait for it. A failure shows on the request that needs it. */
export default definePlugin(() => {
  getPublicFiles().catch(() => {});
});
