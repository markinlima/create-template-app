import type Elysia from "elysia";

import { getModels } from "@shared/routes/utils";

/** Registers the named models (`"ErrorModel"`, `"UserModel"`...) on a route, so its `response` can refer to them by name. Every route uses it. */
export function modelPlugin() {
	return (app: Elysia) => app.model(getModels());
}
