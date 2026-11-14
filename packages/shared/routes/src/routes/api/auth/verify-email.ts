import z from "zod";

import { authValidator } from "../../../validators";

export const verifyEmailBody = z.object({
  email: authValidator.email(),
  otp: authValidator.otp(),
});

export type VerifyEmailBody = z.input<typeof verifyEmailBody>;
