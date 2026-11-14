import type { OpenAPIV3 } from "openapi-types";

/** The responses every route can answer. Spread them first in a route's `response`, then add its own status codes. */
export const defaultResponses = {
	429: "ErrorModel",
	500: "ErrorModel",
} as const;

export const defaultResponseDetails = {
	429: { description: "Rate limit exceeded" },
	500: { description: "Internal server error" },
} satisfies Record<keyof typeof defaultResponses, OpenAPIV3.ResponseObject>;
