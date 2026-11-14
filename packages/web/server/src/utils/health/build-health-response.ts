import type { PublicFile } from "../../types/public-file";

const NO_STORE = { "cache-control": "no-store" };

/**
 * The answer of the health check: `200` when the server can give the app (the build is loaded in memory and has its `index.html`), `503`
 * when it can't. It asks nothing of the API or of any other service on purpose: a front-end that is up must never be reported as down
 * because something outside it is. The build is read once and kept, so a check costs nothing; a failed load is not kept (see
 * `getPublicFiles`), so the next check tries again.
 */
export async function buildHealthResponse(
  getFiles: () => Promise<Map<string, PublicFile>>,
) {
  try {
    if ((await getFiles()).has("/index.html")) {
      return new Response("ok", { headers: NO_STORE });
    }

    return new Response("The build has no index.html", {
      status: 503,
      headers: NO_STORE,
    });
  } catch (error) {
    return new Response(
      `The build can't be loaded: ${error instanceof Error ? error.message : "unknown error"}`,
      { status: 503, headers: NO_STORE },
    );
  }
}
