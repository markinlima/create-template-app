import type Elysia from "elysia";

import { authRoutes } from "./auth/routes";
import { healthRoutes } from "./health/routes";
import { usersRoutes } from "./users/routes";

/** Every domain's routes, in one place: a new domain is a folder under `routes/` and one `.use(...)` here. */
export function appRoutes() {
	return (app: Elysia) => app.use(healthRoutes).use(authRoutes).use(usersRoutes);
}
