import Elysia from "elysia";

import { getSessionRoute } from "./get-session";
import { requestEmailVerificationRoute } from "./request-email-verification";
import { signInRoute } from "./sign-in";
import { signOutRoute } from "./sign-out";
import { signUpRoute } from "./sign-up";
import { verifyEmailRoute } from "./verify-email";

export const authRoutes = new Elysia({ prefix: "/auth" })
	.use(getSessionRoute)
	.use(signUpRoute)
	.use(signInRoute)
	.use(signOutRoute)
	.use(requestEmailVerificationRoute)
	.use(verifyEmailRoute);
