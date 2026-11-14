/**
 * Whether a failed build step was one that downloads something (`bun i`, `apk add`, `apt-get`): the usual sign of the BuildKit DNS
 * problem, which copies the IPv6 nameservers of the host that the build network cannot reach.
 *
 * @param stderr - The error output of `docker compose`.
 */
export function isBuildDownloadError(stderr: string) {
  return /process "\/bin\/sh -c (bun i|bun install|apk add|apt-get)/.test(
    stderr,
  );
}
