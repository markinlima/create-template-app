import { getRadianAngle } from "./get-radian-angle";

/**
 * Give the bounding area of a rotated rectangle.
 *
 * @param width - Width of the rectangle.
 * @param height - Height of the rectangle.
 * @param rotation - Rotation in degrees.
 * @returns The width and height of the area that holds the rotated rectangle.
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
