import { env } from "@/env";
import { InternalServerError } from "@/errors/http/internal-server-error";

export interface SendEmailOptions {
	to: string;
	subject: string;
	text: string;
}

/**
 * FIXME: Placeholder. Connect the e-mail provider here (SMTP, Resend, SES...).
 * Until one exists: in development the message goes to the console (the codes of the e-mail verification included), in tests nothing is
 * sent, and in production it refuses to answer, so a missing provider is never silent.
 */
export async function sendEmail({ to, subject, text }: SendEmailOptions) {
	if (env.NODE_ENV === "production") {
		throw new InternalServerError("Nenhum provedor de e-mail configurado.");
	}

	if (env.NODE_ENV === "development") {
		console.log(`[email] to=${to} subject=${subject}\n${text}`);
	}
}
