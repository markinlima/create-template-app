/** Whether the `If-None-Match` of a request names this ETag (it can list several, be weak with a `W/` prefix, or be `*`). */
export function matchesEtag(ifNoneMatch: string | null, etag: string) {
  if (!ifNoneMatch) {
    return false;
  }

  if (ifNoneMatch.trim() === "*") {
    return true;
  }

  return ifNoneMatch
    .split(",")
    .some((candidate) => candidate.trim().replace(/^W\//, "") === etag);
}
