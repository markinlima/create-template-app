/**
 * Whether the browser refuses to load a script from the address. Blockers match by resource type, so a `fetch` can pass where a `<script>` is cut:
 * only an error counts as blocked, a slow answer does not.
 *
 * @param src - Address of the script.
 * @param timeoutMs - Time, in ms, before it counts as "not blocked".
 * @returns `true` when the script fails to load.
 */
export function isScriptBlocked(src: string, timeoutMs: number) {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    const timeoutId = setTimeout(() => finish(false), timeoutMs);

    function finish(isBlocked: boolean) {
      clearTimeout(timeoutId);
      script.remove();
      resolve(isBlocked);
    }

    script.async = true;
    script.src = src;
    script.addEventListener("load", () => finish(false));
    script.addEventListener("error", () => finish(true));
    document.head.append(script);
  });
}
