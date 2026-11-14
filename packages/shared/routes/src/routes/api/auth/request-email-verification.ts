import z from "zod";

import { authValidator } from "../../../validators";

export const requestEmailVerificationBody = z.object({
  email: authValidator.email(),
});

export type RequestEmailVerificationBody = z.input<
  typeof requestEmailVerificationBody
>;
