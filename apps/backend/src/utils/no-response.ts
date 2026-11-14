import z from "zod";

/** For a route that answers `204 No Content`: `null` is the body, `undefined` isn't representable in JSON. */
export function noResponse() {
	return z.null().catch(null);
}
