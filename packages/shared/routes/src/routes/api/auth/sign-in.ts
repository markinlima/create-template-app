import z from "zod";

import { sessionModel, userModel } from "../../../models";
import { authValidator, usernameValidator } from "../../../validators";

export const signInBody = z.object({
  emailOrUsername: z
    .string()
    .min(1, "Informe seu e-mail ou nome de usuário.")
    .pipe(
      z.union([authValidator.email(), usernameValidator()], {
        error: "Informe um e-mail ou nome de usuário válido.",
      }),
    ),
  password: authValidator.currentPassword(),
});

export const signInResponse = z.object({
  user: userModel,
  session: sessionModel,
});

export type SignInBody = z.input<typeof signInBody>;
export type SignInResponse = z.infer<typeof signInResponse>;
