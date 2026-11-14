import type { CacheRule } from "../../types/web-server-config";

/** Options of {@link getCacheControl}. */
export interface GetCacheControlOptions {
  rules: CacheRule[];
  /** For an address no rule matches. */
  defaultCacheControl: string;
}

/** The `Cache-Control` of an address: the one of the first rule that matches it, or the default. */
export function getCacheControl(
  pathname: string,
  { rules, defaultCacheControl }: GetCacheControlOptions,
) {
  const rule = rules.find(({ match }) =>
    typeof match === "string"
      ? pathname.startsWith(match)
      : match.test(pathname),
  );

  return rule?.cacheControl ?? defaultCacheControl;
}
