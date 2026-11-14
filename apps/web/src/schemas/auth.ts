import { z } from "zod";

export const signInSchema = z.object({
	email: z.email("Digite um e-mail válido"),
	password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
