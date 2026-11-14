/**
 * Convert degrees to radians.
 *
 * @param degreeValue - Angle in degrees.
 * @returns The angle in radians.
 */
export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}
