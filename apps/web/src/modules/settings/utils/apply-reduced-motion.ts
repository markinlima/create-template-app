/**
 * Puts the "less motion" choice on the page, where the CSS reads it (`:root[data-reduced-motion="true"]`).
 * @param root - The element that receives the attribute (the `html` element).
 * @param reducedMotion - `true` turns off the animations and transitions.
 */
export function applyReducedMotion(root: HTMLElement, reducedMotion: boolean) {
	root.dataset.reducedMotion = String(reducedMotion);
}
