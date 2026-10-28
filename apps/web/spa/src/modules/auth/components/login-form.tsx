import { useNavigate } from "@tanstack/react-router";

import { Field, Form } from "@web/form";
import { toast } from "@web/notification";

import { routes } from "@/core/routes";
import { useAppForm } from "@/modules/form/lib/app-form";
import { type SignInSchema, signInSchema } from "@/schemas/auth";

interface LoginFormProps {
	redirectUrl?: string;
}

/** Example of a form built with `@web/form`. FIXME: Replace the fake submit with the sign-in call of the API. */
export function LoginForm({ redirectUrl }: LoginFormProps) {
	const navigate = useNavigate();

	const defaultValues: SignInSchema = { email: "", password: "" };

	const form = useAppForm({
		defaultValues,
		validators: { onChange: signInSchema, onSubmit: signInSchema },
		onSubmit: async () => {
			toast.success({ title: "Login de exemplo", description: "Troque pelo login real." });
			await navigate({ to: redirectUrl || routes.DEFAULT_AUTHENTICATED_URL });
		},
	});

	return (
		<form.AppForm>
			<Form className="w-full space-y-6">
				<form.AppField name="email">
					{(field) => (
						<Field>
							<Field.label>E-mail:</Field.label>
							<field.TextField placeholder="voce@exemplo.com" />
							<Field.error />
						</Field>
					)}
				</form.AppField>
				<form.AppField name="password">
					{(field) => (
						<Field>
							<Field.label>Senha:</Field.label>
							<field.PasswordField />
							<Field.error />
						</Field>
					)}
				</form.AppField>
				<Form.error />
				<Form.submitButton>Entrar</Form.submitButton>
			</Form>
		</form.AppForm>
	);
}
