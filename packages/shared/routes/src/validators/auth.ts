import z from "zod";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_CURRENT_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;

/** The rules a user meets when choosing a password. Sign-in only bounds the length: the rules may have changed since the password was set. */
export const authValidator = {
  email: () => z.email("Endereço de e-mail inválido.").trim().toLowerCase(),
  password: () =>
    z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      .max(MAX_PASSWORD_LENGTH, `No máximo ${MAX_PASSWORD_LENGTH} caracteres.`),
  currentPassword: () =>
    z.string().max(MAX_CURRENT_PASSWORD_LENGTH, "Senha muito longa."),
  otp: () =>
    z
      .string()
      .trim()
      .regex(/^\d{6}$/, "O código precisa ter exatamente 6 dígitos numéricos."),
};

export const usernameValidator = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(MIN_USERNAME_LENGTH, `Pelo menos ${MIN_USERNAME_LENGTH} caracteres.`)
    .max(MAX_USERNAME_LENGTH, `No máximo ${MAX_USERNAME_LENGTH} caracteres.`)
    .regex(/^[a-z0-9_.]+$/, "Use apenas letras, números, ponto e underline.");
