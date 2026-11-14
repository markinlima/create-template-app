import type { Platform } from "../types/platform";

/**
 * Detects the platform of the visitor from `navigator.userAgent`.
 *
 * @returns The platform, or `"unknown"` when none matches.
 * @example
 * detectPlatform(); // "macos"
 */
export function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "iphone";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  if (/mac/.test(userAgent)) {
    return "macos";
  }

  if (/win|windows/.test(userAgent)) {
    return "windows";
  }

  if (/linux/.test(userAgent)) {
    return "linux";
  }

  return "unknown";
}
