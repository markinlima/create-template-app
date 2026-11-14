import Elysia from "elysia";

// ? First: the Sentry SDK starts before any route can fail.
import "./lib/sentry";
import { corsPlugin } from "./http/plugins/cors-plugin";
import { csrfPlugin } from "./http/plugins/csrf-plugin";
import { openapiPlugin } from "./http/plugins/openapi-plugin";
import { appRoutes } from "./http/routes/routes";
import { errorHandler } from "./utils/error-handler";

/**
 * The app: the plugins every request goes through (errors, CORS, CSRF, OpenAPI), then the routes.
 * It is a plain Elysia instance so the tests can call `app.handle(request)` without starting a server.
 */
export const app = new Elysia().onError(errorHandler()).use(corsPlugin()).use(csrfPlugin()).use(openapiPlugin()).use(appRoutes());
