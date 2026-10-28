export type Platform =
  | "android"
  | "iphone"
  | "linux"
  | "macos"
  | "windows"
  | "unknown";

/**
 * Detecta a plataforma do usuário analisando o navigator.userAgent
 * @returns {Platform} A plataforma detectada
 */
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") {
    return "unknown";
  }

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
