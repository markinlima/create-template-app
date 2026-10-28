import { rm } from "node:fs/promises";
import path from "node:path";

// The generated hooks import `useCustomHookOptions` from the app's own implementation
// (see `customOptions.importPath` in kubb.config.ts). Kubb still scaffolds an empty stub for
// that import, using the import path as a file path (hooks/@/hooks/use-custom-hook-options.ts,
// or hooks/use-custom-hook-options.ts for a relative path). Nothing imports it, and it only
// adds type errors, so it is removed.
async function removeCustomHookOptionsStub(dir: string) {
	await rm(path.join(dir, "hooks/@"), { recursive: true, force: true });
	await rm(path.join(dir, "hooks/use-custom-hook-options.ts"), { force: true });
}

// Most generated files typecheck cleanly, so only opt out the specific files
// that have known, unfixable-via-config type errors:
// - HookOptions.ts references a `*Infinite` hook for every query operation,
//   even ones without pagination, whose file kubb never
//   generates. That import can never resolve.
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
const operationIdLine = /^(\s*)operationId: "([\w-]+)",$/m;

async function markQueryKeyIsInfinite(filePath: string, isInfinite: boolean) {
	const file = Bun.file(filePath);
	if (!(await file.exists())) {
		return;
	}

	const content = await file.text();
	const match = content.match(operationIdLine);
	if (!match) {
		console.warn(`Skipped ${filePath}: no operationId found in queryKey`);
		return;
	}

	const [fullMatch, indent] = match;
	const withoutExisting = content.replace(new RegExp(`\\n${indent}isInfinite: (?:true|false),`), "");
	const patched = withoutExisting.replace(fullMatch, `${fullMatch}\n${indent}isInfinite: ${isInfinite},`);

	await Bun.write(filePath, patched);
}

// Any hook whose queryKey carries a paginationType is a listing hook, whether
// or not it has an `*Infinite` counterpart (a hook with
// paginationType "full" may have no infinite variant at all).
const paginatedQueryKey = /paginationType: "(?:cursor|page|full)"/;

// @ts-expect-error unused while the call at the bottom of this file is disabled
// biome-ignore lint/correctness/noUnusedVariables: kept for when the call at the bottom of this file is enabled
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

await addTsNoCheck(genOutputPath);
console.log(`Added @ts-nocheck to generated files in ${genOutputPath}`);

// await markInfiniteQueryKeys(genOutputPath);
// console.log(`Marked isInfinite on paired queryKeys in ${genOutputPath}`);
