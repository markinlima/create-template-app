/**
 * Formats a size in bytes with the biggest unit that fits.
 *
 * @param bytes - The size, in bytes.
 * @param decimals - Digits after the point.
 * @defaultValue 2
 * @returns The size with its unit, e.g. `"1.5 KB"`.
 * @example
 * beautifyBytes(1536); // "1.5 KB"
 */
export function beautifyBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
