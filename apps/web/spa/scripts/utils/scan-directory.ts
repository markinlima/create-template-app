import { readdir } from "node:fs/promises";
import path from "node:path";

interface ScanDirectoryProps {
	dir: string;
	recursive?: boolean;
}

interface FileScanned {
	fullPath: string;
	relativePath: {
		project: string;
		workDir: string;
	};
	ext: string;
	name: string;
}

export async function scanDirectory({ dir, recursive = false }: ScanDirectoryProps): Promise<FileScanned[]> {
	const result: FileScanned[] = [];

	const entries = await readdir(dir, { recursive: recursive, withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(import.meta.dir, entry.parentPath, entry.name);

		const projectRelative = path.join(entry.parentPath, entry.name);
		const workDirRelative = projectRelative.replace(dir, "");

		const ext = path.extname(fullPath);
		const name = path.basename(fullPath, ext);

		if (entry.isDirectory()) {
			continue;
		}

		if (entry.isFile()) {
			result?.push({ fullPath, relativePath: { project: projectRelative, workDir: workDirRelative }, ext, name });
		}
	}
	return result;
}

const a = await scanDirectory({ dir: path.join("public", "images"), recursive: true });
console.log(a);
