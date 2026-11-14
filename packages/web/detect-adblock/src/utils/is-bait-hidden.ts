import { BAIT_CHECK_DELAY_MS } from "../constants/bait-check-delay-ms";

/**
 * Whether an element with the class names of an ad is hidden by the page's blockers (their cosmetic filters).
 *
 * @param classNames - Class names of an ad, given to the bait element.
 * @returns `true` when the element is hidden.
 */
export function isBaitHidden(classNames: string) {
  return new Promise<boolean>((resolve) => {
    const bait = document.createElement("div");
    bait.className = classNames;
    bait.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:10px;height:10px;pointer-events:none;";
    document.body.append(bait);

    setTimeout(() => {
      const style = getComputedStyle(bait);
      const isHidden =
        bait.offsetHeight === 0 ||
        style.display === "none" ||
        style.visibility === "hidden";

      bait.remove();
      resolve(isHidden);
    }, BAIT_CHECK_DELAY_MS);
  });
}
