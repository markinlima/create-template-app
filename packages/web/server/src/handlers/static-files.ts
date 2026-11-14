import { defineHandler } from "nitro";

import { HEALTH_PATH } from "../constants/health";
import { getPublicFiles } from "../lib/get-public-files";
import { getResolvedConfig } from "../lib/get-resolved-config";
import { getPathname } from "../utils/files/get-pathname";
import { respondWithFile } from "../utils/files/respond-with-file";

/**
 * The files of the build, answered from memory (or streamed from the disk when they are big). A request for a file that is not there falls
 * to the next handler, except under the `notFoundPrefixes`: a page of an old build asking for an old hash must fail, not get the shell.
 */
export default defineHandler(async (event) => {
  if (event.req.method !== "GET" && event.req.method !== "HEAD") {
    return;
  }

  const pathname = getPathname(event.req.url);

  // NOTE: the health check answers for itself, so a broken build gives its 503, not this handler's 500
  if (pathname === HEALTH_PATH) {
    return;
  }

  const file = (await getPublicFiles()).get(pathname);

  if (file) {
    return respondWithFile({ file, request: event.req });
  }

  if (
    getResolvedConfig().notFoundPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    )
  ) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
});
