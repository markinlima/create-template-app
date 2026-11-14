import type { Area } from "react-easy-crop";

import { createImage } from "./create-image";
import { getRadianAngle } from "./get-radian-angle";
import { rotateSize } from "./rotate-size";

/** Options of {@link getCroppedImg}. */
interface GetCroppedImgProps {
  imageSrc: string;
  image: File;
  pixelCrop: Area;
  rotation?: number;
  flip?: { horizontal: boolean; vertical: boolean };
}

/**
 * Crop (and rotate or flip) an image on a canvas and give the result as a file.
 * Adapted from the ReadMe of https://github.com/DominicTobias/react-image-crop.
 *
 * @param options - See {@link GetCroppedImgProps}.
 * @returns The cropped file, or `null` when the canvas can't be used.
 */
export async function getCroppedImg({
  imageSrc,
  image,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
}: GetCroppedImgProps): Promise<File | null> {
  const imageTag = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    imageTag.width,
    imageTag.height,
    rotation,
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-imageTag.width / 2, -imageTag.height / 2);

  ctx.drawImage(imageTag, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  const mimeType = image.type.match(/^image\/(jpeg|png|webp)$/)
    ? image.type
    : "image/jpeg";
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Falha ao converter canvas para Blob.");
        resolve(null);
        return;
      }
      try {
        const file = new File([blob], image.name, {
          type: image.type,
          lastModified: Date.now(),
        });
        resolve(file);
      } catch (error) {
        console.error("Erro ao criar o objeto File:", error);
        reject(error);
      }
    }, mimeType);
  });
}
