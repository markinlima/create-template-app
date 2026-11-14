import type { z } from "zod";

import {
  DEFAULT_API_TIMEOUT_MS,
  DEFAULT_MISSING_CONTENT_STATUSES,
} from "../../constants/api-client";

/** The anonymous client `defineHeadRoute` uses to ask the API. */
export interface ApiClient {
  /**
   * Asks the API (anonymously: what a visitor can read) and checks the answer against the schema. It gives `null` when there is nothing
   * to show: the content does not exist, is not public, the API is down or its answer is not what was expected. The page is then served
   * with the tags of the site, so a failure here never breaks a page.
   */
  get: <TSchema extends z.ZodType>(
    path: string,
    schema: TSchema,
  ) => Promise<z.infer<TSchema> | null>;
}

/** Options of {@link createApiClient}. */
export interface CreateApiClientOptions {
  /** The address of the API. */
  url: string;
  /** Sent as `x-api-version`. */
  version?: string;
  /** Other headers of every call. */
  headers?: Record<string, string>;
  /**
   * Time, in ms, to wait before giving up.
   * @defaultValue 5000
   */
  timeoutMs?: number;
  /** What the API answers for content a visitor can't read; no log line for them. */
  missingStatuses?: number[];
  /** `fetch`, replaced in the tests. */
  fetcher?: typeof fetch;
}

/**
 * Create the client that asks the API for the content of a page with data.
 *
 * @param options - See {@link CreateApiClientOptions}.
 * @returns An {@link ApiClient} whose `get` gives `null` instead of throwing.
 */
export function createApiClient({
  url,
  version,
  headers = {},
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
  missingStatuses = DEFAULT_MISSING_CONTENT_STATUSES,
  fetcher = fetch,
}: CreateApiClientOptions): ApiClient {
  const base = url.replace(/\/+$/, "");

  return {
    async get(path, schema) {
      try {
        const response = await fetcher(`${base}${path}`, {
          headers: {
            accept: "application/json",
            ...(version && { "x-api-version": version }),
            ...headers,
          },
          signal: AbortSignal.timeout(timeoutMs),
        });

        if (missingStatuses.includes(response.status)) {
          return null;
        }

        if (!response.ok) {
          console.warn(
            `[web-server] the call to ${path} answered ${response.status}`,
          );
          return null;
        }

        const parsed = schema.safeParse(await response.json());

        if (!parsed.success) {
          console.warn(
            `[web-server] the answer of ${path} does not match its schema`,
          );
          return null;
        }

        return parsed.data;
      } catch (error) {
        console.warn(
          `[web-server] the call to ${path} failed:`,
          error instanceof Error ? error.message : error,
        );
        return null;
      }
    },
  };
}
