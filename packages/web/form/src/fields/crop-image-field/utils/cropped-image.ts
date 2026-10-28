import type { Area } from "react-easy-crop";

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */

interface GetCroppedImgProps {
  imageSrc: string;
  image: File;
  pixelCrop: Area;
  rotation?: number;
  flip?: { horizontal: boolean; vertical: boolean };
}

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

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    imageTag.width,
    imageTag.height,
    rotation,
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-imageTag.width / 2, -imageTag.height / 2);

  // draw rotated image
  ctx.drawImage(imageTag, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
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
