import { createAppForm } from "@web/form";

import { getApiErrorMessage } from "@/lib/axios/get-api-error-message";

export const { useAppForm, withForm } = createAppForm({
	// ? Project-specific field components go here: `fieldComponents: { MyField }`.
	// ? API errors carry the user-facing message in the response body: { message }.
	getSubmitErrorMessage: getApiErrorMessage,
});
