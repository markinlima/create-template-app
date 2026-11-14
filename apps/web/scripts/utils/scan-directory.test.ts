import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, test as it } from "bun:test";

import { scanDirectory } from "./scan-directory";

let root = "";

beforeAll(async () => {
	root = await mkdtemp(path.join(tmpdir(), "scan-directory-"));
	await mkdir(path.join(root, "a", "b"), { recursive: true });
	await writeFile(path.join(root, "top.webp"), "");
	await writeFile(path.join(root, "a", "mid.png"), "");
	await writeFile(path.join(root, "a", "b", "deep.svg"), "");
});

afterAll(async () => {
	await rm(root, { recursive: true, force: true });
});

describe("scanDirectory", () => {
	it("lists only the files of the folder when it is not recursive", async () => {
		const files = await scanDirectory({ dir: root });

		expect(files.map((file) => file.name)).toEqual(["top"]);
	});

	it("lists the files at any depth when it is recursive, never the folders", async () => {
		const files = await scanDirectory({ dir: root, recursive: true });

		expect(files.map((file) => file.name).sort()).toEqual(["deep", "mid", "top"]);
		expect(files.find((file) => file.name === "mid")?.ext).toBe(".png");
	});

	it("gives the full path of a file that exists", async () => {
		const files = await scanDirectory({ dir: root, recursive: true });

		for (const file of files) {
			expect(existsSync(file.fullPath)).toBe(true);
		}
	});
});
