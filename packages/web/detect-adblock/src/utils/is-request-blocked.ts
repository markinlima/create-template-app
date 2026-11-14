import type { RequestProbe } from "../types/request-probe";

/**
 * Whether the browser cancels the request. The server only has to answer (any status is enough, even a refusal), so a rejection means a blocker.
 * Send the same request the real code sends (method and query string): blockers match on them.
 *
 * @param probe - The request to try.
 * @param timeoutMs - Time, in ms, before the attempt is given up.
 * @returns `true` when the request is rejected or cancelled.
 */
export async function isRequestBlocked(probe: RequestProbe, timeoutMs: number) {
  try {
    await fetch(probe.url, {
      method: probe.method ?? "GET",
      body: probe.method === "POST" ? "" : undefined,
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    return false;
  } catch {
    return true;
  }
}
