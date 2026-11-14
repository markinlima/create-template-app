import type { RequestProbe } from "./request-probe";

/** Options of {@link detectAdblock}. */
export interface DetectAdblockOptions {
  /**
   * Class names of an ad, given to an element that the cosmetic filters hide.
   * @defaultValue "adsbox ad-banner ad-placeholder pub_300x250 text-ad textAd text_ad"
   */
  baitClassNames?: string;
  /**
   * A script of the app served from a path named like an ad (the file must exist, empty is fine): the filter lists cut it even on the
   * app's own domain. Pass `null` to skip it.
   * @defaultValue "/ads/ads.js"
   */
  ownBaitUrl?: string | null;
  /**
   * A well-known ad script, which catches the blockers that only cut other domains. Pass `null` to skip it.
   * @defaultValue "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
   */
  thirdPartyBaitUrl?: string | null;
  /**
   * Requests the app really makes that blockers cut (analytics, error reports).
   * @defaultValue []
   */
  requests?: RequestProbe[];
  /**
   * Time, in ms, a probe waits before it counts as "not blocked".
   * @defaultValue 5000
   */
  timeoutMs?: number;
}
