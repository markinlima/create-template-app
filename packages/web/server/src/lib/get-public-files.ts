import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { PublicFile } from "../types/public-file";
import { getCacheControl } from "../utils/files/get-cache-control";
import { loadPublicFiles } from "../utils/files/load-public-files";
import { getResolvedConfig } from "./get-resolved-config";
import { publicDir } from "./runtime";

declare global {
  // NOTE: set by the Nitro bundle, the file the server started from
  var __nitro_main__: string;
}

let loading: Promise<Map<string, PublicFile>> | undefined;

/**
 * The build, read once. It is loaded on demand, not when the module is evaluated, because the bundle sets `__nitro_main__` only after its
 * imports ran. A failed load is not kept, so the next request tries again. The security headers and the cache rules of the app are part of
 * every variant, so a request does not build them.
 */
export function getPublicFiles() {
  loading ??= (() => {
    const {
      securityHeaders,
      cacheRules,
      defaultCacheControl,
      preloadMaxBytes,
    } = getResolvedConfig();

    return loadPublicFiles(
      join(dirname(fileURLToPath(globalThis.__nitro_main__)), publicDir),
      {
        headers: securityHeaders,
        preloadMaxBytes,
        getCacheControl: (pathname) =>
          getCacheControl(pathname, { rules: cacheRules, defaultCacheControl }),
      },
    );
  })().catch((error: unknown) => {
    loading = undefined;
    throw error;
  });

  return loading;
}
