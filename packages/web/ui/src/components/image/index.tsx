import { ImageRoot } from "./image-root";

export const Image = Object.assign(ImageRoot, {});

/**
 * Registry of known local image paths, used for `src` autocomplete.
 * Apps augment it to register their own images:
 *
 * declare module "@web/ui/image" {
 *   interface ImageRegistry { src: "/logo.png" | "/banner.jpg" }
 * }
 */
// biome-ignore lint/suspicious/noEmptyInterface: empty on purpose, augmented by the consuming app
export interface ImageRegistry {}
