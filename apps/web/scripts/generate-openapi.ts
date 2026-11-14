import path from "node:path";

import * as p from "@clack/prompts";

// ? CONFIG

// ? Where the OpenAPI JSON can be: `localhost` when the backend runs on the same machine as the script, and `backend` (the name of the
// ? service in the Docker network) when the script runs inside the dev container. They are tried in this order and the first answer wins.
const openapiUrls = ["http://localhost:3333/docs/json", "http://backend:3333/docs/json"];
// ? Time to wait for each address; a host that doesn't exist or doesn't answer must not hold the script.
const requestTimeoutInMs = 5000;
// ? Path of the local OpenAPI JSON file
const openapiJsonPath = path.join("openapi.json");

interface FetchOpenApiResult {
	url: string;
	response: Response;
}

async function fetchOpenApi(): Promise<FetchOpenApiResult> {
	const failures: string[] = [];

	for (const url of openapiUrls) {
		p.log.step(`Fetching OpenAPI JSON from ${url}...`);

		try {
			const response = await fetch(url, { signal: AbortSignal.timeout(requestTimeoutInMs) });

			if (response.ok) {
				return { url, response };
			}

			failures.push(`${url} (status ${response.status})`);
		} catch (error) {
			failures.push(`${url} (${error instanceof Error ? error.message : "request failed"})`);
		}
	}

	p.log.error(`Error:\n Failed to fetch OpenAPI JSON. Is the backend running?\n Tried:\n - ${failures.join("\n - ")}`);
	process.exit(1);
}

async function generateOpenApi() {
	p.box("🌐 OpenAPI Generator ⚙️", "", {
		contentAlign: "center",
		contentPadding: 2,
		rounded: true,
	});

	const { url, response: request } = await fetchOpenApi();

	p.log.info(`Using ${url}`);

	const data = await request.json();

	p.log.step("OpenAPI JSON fetched successfully.");

	// ? Minified: nobody reads this file (only Kubb does), and it is about a third smaller without the indentation.
	await Bun.write(openapiJsonPath, JSON.stringify(data));

	p.log.success("OpenAPI JSON saved to openapi.json");

	const kubbSpinner = p.spinner();

	kubbSpinner.start("Generating types and function from OpenAPI schema...");

	try {
		await Bun.$`bun tool:kubb`.quiet();
	} catch (error) {
		kubbSpinner.error("Failed to generate TypeScript types from OpenAPI schema.");
		console.error(error);
		process.exit(1);
	}

	kubbSpinner.stop("Gerneration completed!");
	p.log.success("TypeScript types and functions generated successfully.");
	process.exit(0);
}

await generateOpenApi();
