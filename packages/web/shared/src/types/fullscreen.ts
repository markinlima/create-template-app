/** The element `useFullscreen` takes to fullscreen; `null` takes the whole page. */
export type FullscreenRef = React.RefObject<HTMLElement> | null;

/** `Document` with the vendor-prefixed Fullscreen API of the older browsers. */
export interface VendorDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

/** `HTMLElement` with the vendor-prefixed Fullscreen API of the older browsers. */
export interface VendorElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}
