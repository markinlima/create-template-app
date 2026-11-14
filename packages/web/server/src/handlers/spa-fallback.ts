import { defineHandler } from "nitro";

import { getPublicFiles } from "../lib/get-public-files";
import { getResolvedConfig } from "../lib/get-resolved-config";
import { respondWithFile } from "../utils/files/respond-with-file";

/**
 * Every address that is not a file is a client-side route: it gets the shell and the router renders the page. A route with a handler of its
 * own (the previews of the pages with data) takes precedence over this one.
 */
export default defineHandler(async (event) => {
  if (event.req.method !== "GET" && event.req.method !== "HEAD") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  if (!getResolvedConfig().spaFallback) {
    return new Response("Not found", { status: 404 });
  }

  const shell = (await getPublicFiles()).get("/index.html");

  if (!shell) {
    return new Response("The build has no index.html", { status: 500 });
  }

  return respondWithFile({ file: shell, request: event.req });
});
