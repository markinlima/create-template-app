/** A `Cache-Control` for the addresses that match. The first rule that matches wins. */
export interface CacheRule {
  /** A string is the start of the address (`"/assets/"`); a regular expression is tested against all of it. */
  match: string | RegExp;
  cacheControl: string;
}

/** The API a `defineHeadRoute` asks for the content of its page. It is asked anonymously: what a visitor can read. */
export interface ApiConfig {
  /** The address of the API. A function is run when the server needs it, so it can read the environment the server started with. */
  url: string | (() => string);
  /** Sent as `x-api-version`. */
  version?: string | (() => string);
  /** Other headers of every call (the platform, the user agent...). */
  headers?: Record<string, string>;
  /** How long to wait before giving up. @defaultValue 5000 */
  timeoutMs?: number;
  /** What the API answers for content a visitor can't read. Not worth a log line, any other failure is. @defaultValue [401, 403, 404] */
  missingStatuses?: number[];
}

/** What the app tells the web server (`server/web-server.config.ts`). Everything has a default. */
export interface WebServerConfig {
  /** Sent with every response. A function is run once, when the server starts, so one image can serve every environment. */
  securityHeaders?: Record<string, string> | (() => Record<string, string>);
  /** The `Cache-Control` of the files, by address. */
  cacheRules?: CacheRule[];
  /** For an address no rule matches. @defaultValue "no-cache" */
  defaultCacheControl?: string;
  /** Addresses that answer `404` when there is no file, instead of getting the app (an old build asking for an old hash must fail). @defaultValue ["/assets/"] */
  notFoundPrefixes?: string[];
  /** A file up to this size is kept in memory; a bigger one is streamed from the disk. @defaultValue 5242880 */
  preloadMaxBytes?: number;
  /** Every address that is not a file gets the `index.html`, and the router of the app renders the page. @defaultValue true */
  spaFallback?: boolean;
  /** Needed by `defineHeadRoute`. */
  api?: ApiConfig;
}

/** The `api` config with every default applied and every function run. */
export interface ResolvedApiConfig {
  url: string;
  version?: string;
  headers: Record<string, string>;
  timeoutMs: number;
  missingStatuses: number[];
}

/** The config with its defaults and its functions run. */
export interface ResolvedWebServerConfig {
  securityHeaders: Record<string, string>;
  cacheRules: CacheRule[];
  defaultCacheControl: string;
  notFoundPrefixes: string[];
  preloadMaxBytes: number;
  spaFallback: boolean;
  api?: ResolvedApiConfig;
}
