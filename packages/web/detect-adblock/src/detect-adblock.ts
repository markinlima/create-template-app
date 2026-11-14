import { DEFAULT_BAIT_CLASS_NAMES } from "./constants/default-bait-class-names";
import { DEFAULT_OWN_BAIT_URL } from "./constants/default-own-bait-url";
import { DEFAULT_THIRD_PARTY_BAIT_URL } from "./constants/default-third-party-bait-url";
import { DEFAULT_TIMEOUT_MS } from "./constants/default-timeout-ms";
import type { DetectAdblockOptions } from "./types/detect-adblock-options";
import { isBaitHidden } from "./utils/is-bait-hidden";
import { isRequestBlocked } from "./utils/is-request-blocked";
import { isScriptBlocked } from "./utils/is-script-blocked";
import { withCacheBuster } from "./utils/with-cache-buster";

/**
 * Whether an ad blocker is on. A page cannot ask the browser, so it looks for the effects: an element with the class names of an ad being hidden,
 * scripts and requests being cancelled. Any one counts, and the answer comes as soon as the first one says yes, without waiting for the slowest.
 * Browser only.
 *
 * @param options - See {@link DetectAdblockOptions}.
 * @returns `true` as soon as one probe finds a blocker, `false` when all are done and none did. It never rejects.
 * @example
 * const hasAdblock = await detectAdblock({ requests: [{ url: "https://errors.example.test/api/1/envelope/", method: "POST" }] });
 */
export function detectAdblock(options: DetectAdblockOptions = {}) {
  const {
    baitClassNames = DEFAULT_BAIT_CLASS_NAMES,
    ownBaitUrl = DEFAULT_OWN_BAIT_URL,
    thirdPartyBaitUrl = DEFAULT_THIRD_PARTY_BAIT_URL,
    requests = [],
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const probes = [
    isBaitHidden(baitClassNames),
    ...requests.map((request) => isRequestBlocked(request, timeoutMs)),
  ];

  if (ownBaitUrl) {
    probes.push(isScriptBlocked(withCacheBuster(ownBaitUrl), timeoutMs));
  }

  if (thirdPartyBaitUrl) {
    probes.push(isScriptBlocked(thirdPartyBaitUrl, timeoutMs));
  }

  return new Promise<boolean>((resolve) => {
    let pending = probes.length;

    for (const probe of probes) {
      probe.then((isBlocked) => {
        pending -= 1;

        if (isBlocked || pending === 0) {
          resolve(isBlocked);
        }
      });
    }
  });
}
