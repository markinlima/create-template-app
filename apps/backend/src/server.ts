import { styleText } from "node:util";

import { runMigrations } from "@backend/db/migrator";

import { app } from "./app";
import { env } from "./env";

if (env.RUN_MIGRATIONS) {
	try {
		await runMigrations();
	} catch (error) {
		console.error(styleText("red", "Failed to run migrations:"), error);
		throw error;
	}
}

app.listen({ port: env.PORT, hostname: "0.0.0.0" }, ({ url }) => {
	console.log(styleText("green", `🚀 HTTP server running at ${url}`));

	if (env.NODE_ENV !== "production") {
		console.log(styleText("green", `📚 Docs available at ${new URL("/docs", url).toString()}`));
	}
});
