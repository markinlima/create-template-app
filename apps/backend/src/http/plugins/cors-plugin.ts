import cors from "@elysiajs/cors";

import { env } from "@/env";

export function corsPlugin() {
	return cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
		credentials: true,
		allowedHeaders: ["content-type", "authorization"],
	});
}
