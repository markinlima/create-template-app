/** Options of {@link withUtm}. */
export interface WithUtmOptions {
  /** `utm_source`: where the link is shared (a channel). */
  source: string;
  /** `utm_medium`: the kind of channel. */
  medium: string;
  /** `utm_campaign`: the campaign the link belongs to. */
  campaign: string;
  /** `utm_content`, set only when given. */
  content?: string;
}

/**
 * Set the standard `utm_*` params on a URL, keeping the params it already has.
 *
 * @param url - An absolute URL.
 * @param options - See {@link WithUtmOptions}.
 * @returns The URL with the params set.
 * @example
 * withUtm("https://example.test/p/1", { source: "x", medium: "share", campaign: "post" });
 * // "https://example.test/p/1?utm_source=x&utm_medium=share&utm_campaign=post"
 */
export function withUtm(url: string, options: WithUtmOptions): string {
  const target = new URL(url);

  target.searchParams.set("utm_source", options.source);
  target.searchParams.set("utm_medium", options.medium);
  target.searchParams.set("utm_campaign", options.campaign);

  if (options.content !== undefined) {
    target.searchParams.set("utm_content", options.content);
  }

  return target.toString();
}
