import {
  DEFAULT_API_TIMEOUT_MS,
  DEFAULT_MISSING_CONTENT_STATUSES,
} from "../../constants/api-client";
import { DEFAULT_CACHE_CONTROL } from "../../constants/cache-control";
import { DEFAULT_NOT_FOUND_PREFIXES } from "../../constants/not-found-prefixes";
import { DEFAULT_PRELOAD_MAX_BYTES } from "../../constants/preload-max-bytes";
import type {
  ResolvedWebServerConfig,
  WebServerConfig,
} from "../../types/web-server-config";

function run<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value;
}

/** The config with its defaults, and the functions in it run (they read the environment the server started with). */
export function resolveWebServerConfig(
  config: WebServerConfig = {},
): ResolvedWebServerConfig {
  const { api } = config;

  return {
    securityHeaders: run(config.securityHeaders ?? {}),
    cacheRules: config.cacheRules ?? [],
    defaultCacheControl: config.defaultCacheControl ?? DEFAULT_CACHE_CONTROL,
    notFoundPrefixes: config.notFoundPrefixes ?? DEFAULT_NOT_FOUND_PREFIXES,
    preloadMaxBytes: config.preloadMaxBytes ?? DEFAULT_PRELOAD_MAX_BYTES,
    spaFallback: config.spaFallback ?? true,
    api: api && {
      url: run(api.url),
      version: api.version === undefined ? undefined : run(api.version),
      headers: api.headers ?? {},
      timeoutMs: api.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
      missingStatuses: api.missingStatuses ?? DEFAULT_MISSING_CONTENT_STATUSES,
    },
  };
}
