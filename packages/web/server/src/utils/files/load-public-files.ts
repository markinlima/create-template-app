import { join } from "node:path";

import { DEFAULT_CACHE_CONTROL } from "../../constants/cache-control";
import { DEFAULT_PRELOAD_MAX_BYTES } from "../../constants/preload-max-bytes";
import type { PublicFile, ServedVariant } from "../../types/public-file";

/** Options of {@link loadPublicFiles}. */
export interface LoadPublicFilesOptions {
  /** Size, in bytes, up to which a file is read into memory. @defaultValue 5242880 */
  preloadMaxBytes?: number;
  /** The `Cache-Control` of an address. @defaultValue "no-cache" for every address */
  getCacheControl?: (pathname: string) => string;
  /** Headers every answer carries (the security headers). They are part of each variant, so a request does not build them. */
  headers?: Record<string, string>;
}

interface BuildVariantOptions {
  path: string;
  pathname: string;
  type: string;
  preloadMaxBytes: number;
  /** Set when the file has compressed copies, so every copy tells caches the answer depends on `Accept-Encoding`. */
  vary: boolean;
  headers: Record<string, string>;
  getCacheControl: (pathname: string) => string;
  encoding?: "gzip" | "br";
}

async function buildVariant({
  path,
  pathname,
  type,
  preloadMaxBytes,
  vary,
  headers,
  getCacheControl,
  encoding,
}: BuildVariantOptions): Promise<ServedVariant> {
  const file = Bun.file(path);
  // NOTE: size and mtime tell a new build apart; hashing big files at start would be slow
  const etag = `"${file.size.toString(16)}-${Math.floor(file.lastModified).toString(16)}${encoding ? `-${encoding}` : ""}"`;
  const cacheHeaders = {
    ...headers,
    ETag: etag,
    "Cache-Control": getCacheControl(pathname),
    ...(vary && { Vary: "Accept-Encoding" }),
  };

  return {
    body:
      file.size <= preloadMaxBytes
        ? new Uint8Array(await file.arrayBuffer())
        : file,
    etag,
    init: {
      headers: {
        ...cacheHeaders,
        "Content-Type": type,
        ...(encoding && { "Content-Encoding": encoding }),
      },
    },
    notModifiedInit: { status: 304, headers: cacheHeaders },
  };
}

async function exists(path: string) {
  return Bun.file(path).exists();
}

/**
 * Reads the build into a map of address to file: every file of the folder, the `index.html` of each folder at the address of the folder
 * (`about-us/index.html` is `/about-us`, the root one is `/`), and the `.gz` and `.br` copies the build wrote next to a file as its
 * compressed variants. Nothing is compressed here.
 */
export async function loadPublicFiles(
  directory: string,
  {
    preloadMaxBytes = DEFAULT_PRELOAD_MAX_BYTES,
    headers = {},
    getCacheControl = () => DEFAULT_CACHE_CONTROL,
  }: LoadPublicFilesOptions = {},
) {
  const files = new Map<string, PublicFile>();

  for await (const relativePath of new Bun.Glob("**/*").scan({
    cwd: directory,
  })) {
    if (/\.(gz|br|zst)$/.test(relativePath)) {
      continue;
    }

    const path = join(directory, relativePath);
    const pathname = `/${relativePath}`;
    const type = pathname.endsWith(".webmanifest")
      ? "application/manifest+json"
      : Bun.file(path).type;
    const hasGzip = await exists(`${path}.gz`);
    const hasBrotli = await exists(`${path}.br`);
    const common = {
      pathname,
      type,
      preloadMaxBytes,
      headers,
      getCacheControl,
      vary: hasGzip || hasBrotli,
    };

    const file: PublicFile = {
      raw: await buildVariant({ ...common, path }),
      ...(hasGzip && {
        gzip: await buildVariant({
          ...common,
          path: `${path}.gz`,
          encoding: "gzip",
        }),
      }),
      ...(hasBrotli && {
        brotli: await buildVariant({
          ...common,
          path: `${path}.br`,
          encoding: "br",
        }),
      }),
    };

    files.set(pathname, file);

    if (relativePath.endsWith("index.html")) {
      const folder = relativePath
        .slice(0, -"index.html".length)
        .replace(/\/$/, "");

      files.set(folder ? `/${folder}` : "/", file);
    }
  }

  return files;
}
