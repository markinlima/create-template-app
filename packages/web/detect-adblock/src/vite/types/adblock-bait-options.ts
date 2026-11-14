/** Options of {@link adblockBait}. */
export interface AdblockBaitOptions {
  /**
   * Address the bait script is served from. It must be the same `ownBaitUrl` given to `detectAdblock`.
   * @defaultValue "/ads/ads.js"
   */
  path?: string;
}
