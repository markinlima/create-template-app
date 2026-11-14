import type { PublicFile, ServedVariant } from "../../types/public-file";

/** The quality a client gives to an encoding in `Accept-Encoding` (`gzip;q=0` is 0, a bare `gzip` is 1, a missing one is 0). */
function getQuality(acceptEncoding: string, encoding: string) {
  let wildcard = 0;

  for (const part of acceptEncoding.split(",")) {
    const [name, ...parameters] = part.trim().toLowerCase().split(";");
    const quality = parameters
      .map((parameter) => parameter.trim())
      .find((parameter) => parameter.startsWith("q="));
    const value = quality ? Number.parseFloat(quality.slice(2)) : 1;
    const weight = Number.isNaN(value) ? 1 : value;

    if (name === encoding) {
      return weight;
    }

    if (name === "*") {
      wildcard = weight;
    }
  }

  return wildcard;
}

/** Brotli when the client takes it, then gzip, then the file as it is. Only what was compressed at build exists, nothing is compressed here. */
export function pickVariant(
  file: PublicFile,
  acceptEncoding: string | null,
): ServedVariant {
  if (!acceptEncoding) {
    return file.raw;
  }

  if (file.brotli && getQuality(acceptEncoding, "br") > 0) {
    return file.brotli;
  }

  if (file.gzip && getQuality(acceptEncoding, "gzip") > 0) {
    return file.gzip;
  }

  return file.raw;
}
