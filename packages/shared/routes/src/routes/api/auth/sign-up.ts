import z from "zod";

import { userModel } from "../../../models";
import { authValidator, usernameValidator } from "../../../validators";

export const signUpBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe seu nome.")
    .max(100, "Nome muito longo."),
  username: usernameValidator(),
  email: authValidator.email(),
  password: authValidator.password(),
});

export const signUpResponse = z.object({
  user: userModel,
});

export type SignUpBody = z.input<typeof signUpBody>;
export type SignUpResponse = z.infer<typeof signUpResponse>;
