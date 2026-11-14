/**
 * Time, in ms, the server waits for the API before it serves the page with the tags of the site.
 * @defaultValue 5000
 */
export const DEFAULT_API_TIMEOUT_MS = 5000;

/**
 * API statuses for content a visitor cannot read (not allowed, not signed in, missing). They are the normal case for a private or deleted
 * link, so they are not logged; any other failure is.
 * @defaultValue [401, 403, 404]
 */
export const DEFAULT_MISSING_CONTENT_STATUSES = [401, 403, 404];
