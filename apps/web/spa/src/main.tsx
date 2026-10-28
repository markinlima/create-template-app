import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
// biome-ignore lint/correctness/noUnresolvedImports: Biome does not see the named exports of the CJS build of react
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { getQueryClient } from "@/lib/tanstack-query";
import { createRouter } from "@/router";

import "@/lib/sentry-sdk";
// biome-ignore lint/correctness/noUnresolvedImports: Compiled by tailwind, biome doesn't know about it
import "@/styles/global.css";

const queryClient = getQueryClient();
const router = createRouter({ queryClient });

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("The #root element was not found in index.html");
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
