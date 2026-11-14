/** The user-facing texts of the errors Better Auth raises (keyed by its error code). Everything shown to the user is in pt-BR. FIXME: Placeholder, extend it with the codes your flows use. */
export const pt = {
	INVALID_EMAIL_OR_PASSWORD: "E-mail, nome de usuário ou senha inválidos.",
	INVALID_USERNAME_OR_PASSWORD: "Nome de usuário ou senha inválidos.",
	USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Já existe uma conta com este e-mail.",
	USERNAME_IS_ALREADY_TAKEN: "Este nome de usuário já está em uso.",
	INVALID_OTP: "Código inválido.",
	OTP_EXPIRED: "Este código expirou. Peça um novo.",
	TOO_MANY_ATTEMPTS: "Muitas tentativas. Peça um novo código.",
} as const;
