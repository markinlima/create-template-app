import Elysia from "elysia";

import { getHealthRoute } from "./get-health";

export const healthRoutes = new Elysia().use(getHealthRoute);
