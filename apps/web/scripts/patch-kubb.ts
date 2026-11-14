import { rm } from "node:fs/promises";
import path from "node:path";

import { encodeUrlParams } from "@shared/utils";

// The generated hooks import `useCustomHookOptions` from the app's own implementation
// (see `customOptions.importPath` in kubb.config.ts). Kubb still scaffolds an empty stub for
// that import, using the import path as a file path (hooks/@/hooks/use-custom-hook-options.ts,
// or hooks/use-custom-hook-options.ts for a relative path). Nothing imports it, and it only
// adds type errors, so it is removed.
async function removeCustomHookOptionsStub(dir: string) {
	await rm(path.join(dir, "hooks/@"), { recursive: true, force: true });
	await rm(path.join(dir, "hooks/use-custom-hook-options.ts"), { force: true });
}

// The generated clients interpolate path params straight into the URL, so a
// param such as "..%2Fusers%2F1" would change the path that is
// requested. Encode every path param.
async function encodeClientUrlParams(dir: string) {
	const glob = new Bun.Glob("clients/*.ts");

	for await (const relativePath of glob.scan({ cwd: dir })) {
		const filePath = path.join(dir, relativePath);
		const content = await Bun.file(filePath).text();
		const patched = encodeUrlParams(content);

		if (patched !== content) {
			await Bun.write(filePath, patched);
		}
	}
}

// Most generated files typecheck cleanly, so only opt out the specific files
// that have known, unfixable-via-config type errors:
// - HookOptions.ts references a `*Infinite` hook for every query operation,
//   even ones without pagination (e.g. useGetHealth), whose file kubb never
//   generates. That import can never resolve.
// - The multipart upload clients cast our custom FormData (built by
//   build-form-data.ts) to the operation's JSON request type, which
//   structurally can never match (missing the `file` property). Add such a client here.
const filesRequiringTsNoCheck = ["hooks/HookOptions.ts"];

async function addTsNoCheck(dir: string) {
	for (const relativePath of filesRequiringTsNoCheck) {
		const filePath = path.join(dir, relativePath);
		const file = Bun.file(filePath);
		if (!(await file.exists())) {
			console.warn(`Skipped @ts-nocheck for ${relativePath}: file not found`);
			continue;
		}

		const content = await file.text();
		if (content.startsWith("// @ts-nocheck")) {
			continue;
		}

		await Bun.write(filePath, `// @ts-nocheck\n${content}`);
	}
}

// Kubb generates the same queryKey for a hook's plain and `*Infinite` variant
// (both are derived from the same operation), so mounting one after the other
// reuses the other's cache entry, which has an incompatible shape (plain data
// vs `{ pages, pageParams }`) and crashes `getNextPageParam`. Tag both variants'
// keys so they never collide with each other's cache entry.
// ? Kubb breaks the key object in lines or keeps it in one, depending on its length, so the match only needs the opening brace and the operation id.
const queryKeyHead = /(\{\s*operationId: "[\w-]+",)/;
const existingIsInfinite = /\s*isInfinite: (?:true|false),/;

async function markQueryKeyIsInfinite(filePath: string, isInfinite: boolean) {
	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		return;
	}

	const content = await file.text();
	if (!queryKeyHead.test(content)) {
		console.warn(`Skipped ${filePath}: no operationId found in queryKey`);
		return;
	}

	// ? Replaced if it is already there, so running the patch twice is harmless.
	const withoutExisting = content.replace(existingIsInfinite, "");
	const patched = withoutExisting.replace(queryKeyHead, `$1 isInfinite: ${isInfinite},`);

	await Bun.write(filePath, patched);
}

// Any hook whose queryKey carries a paginationType is a listing hook, whether
// or not it has an `*Infinite` counterpart (a list with paginationType "full" and no infinite variant at all).
const paginatedQueryKey = /paginationType: "(?:cursor|page|full)"/;

async function markInfiniteQueryKeys(dir: string) {
	const glob = new Bun.Glob("hooks/*.ts");

	for await (const relativePath of glob.scan({ cwd: dir })) {
		if (relativePath === "hooks/HookOptions.ts") {
			continue;
		}

		const filePath = path.join(dir, relativePath);
		const content = await Bun.file(filePath).text();
		if (!paginatedQueryKey.test(content)) {
			continue;
		}

		const isInfinite = relativePath.endsWith("Infinite.ts");
		await markQueryKeyIsInfinite(filePath, isInfinite);
	}
}

const genOutputPath = path.resolve(import.meta.dirname, "..", "src/gen/api");

await removeCustomHookOptionsStub(genOutputPath);
console.log(`Removed the scaffolded use-custom-hook-options stub in ${genOutputPath}`);

await encodeClientUrlParams(genOutputPath);
console.log(`Encoded the path params of the clients in ${genOutputPath}`);

await addTsNoCheck(genOutputPath);
console.log(`Added @ts-nocheck to generated files in ${genOutputPath}`);

await markInfiniteQueryKeys(genOutputPath);
console.log(`Marked isInfinite on paired queryKeys in ${genOutputPath}`);
