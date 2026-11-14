import Elysia from "elysia";

import { getMeRoute } from "./get-me";

export const usersRoutes = new Elysia({ prefix: "/users" }).use(getMeRoute);
