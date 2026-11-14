/**
 * Load an image from an address, with `crossOrigin` set so a canvas can read it.
 *
 * @param url - Address of the image.
 * @returns The loaded image; rejects when it fails to load.
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
