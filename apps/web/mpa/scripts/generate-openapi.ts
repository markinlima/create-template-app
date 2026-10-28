import path from "node:path";

import * as p from "@clack/prompts";

console.clear();

// ? CONFIG

// ? URL do endpoint OpenAPI JSON
const openapiUrl = "http://localhost:3333/docs/json";
// ? Caminho do arquivo OpenAPI JSON local
const openapiJsonPath = path.join("openapi.json");

async function generateOpenApi() {
	p.box("🌐 OpenAPI Generator ⚙️", "", {
		contentAlign: "center",
		contentPadding: 2,
		rounded: true,
	});

	p.log.step(`Fetching OpenAPI JSON from ${openapiUrl}...`);

	const request = await fetch(openapiUrl);

	if (!request.ok) {
		p.log.error(`Error:\n Failed to fetch OpenAPI JSON. \n URL: ${openapiUrl}. \n Status: ${request.status}`);
		process.exit(1);
	}

	const data = await request.json();

	p.log.step("OpenAPI JSON fetched successfully.");

	await Bun.write(openapiJsonPath, JSON.stringify(data, null, 2));

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
