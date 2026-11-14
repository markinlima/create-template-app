import { existsSync } from "node:fs";
import path from "node:path";

import * as p from "@clack/prompts";

import { beautifyBytes } from "./utils/beautify-bytes";
import { compressImage } from "./utils/compress-image";
import { isIgnoredImage, type OptimizeImagesIgnore } from "./utils/is-ignored-image";
import { scanDirectory } from "./utils/scan-directory";

// ? Folder offered by default when the script asks where the images are
const DEFAULT_IMAGES_DIR = path.join("public", "images");
// ? WebP quality (0-100, where 100 is the best)
const QUALITY = 80;
// ? Width the images are resized to
const WIDTH = 720;
// ? Height the images are resized to (undefined keeps the original proportion)
const HEIGHT = undefined;
// ? File extensions that can be compressed
const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".bmp", ".tiff"];
// ? What the script leaves alone: a file here is not converted and not deleted. To keep something out add its extension or the name of its
// ? folder (at any depth) to the lists.
const OPTIMIZE_IMAGES_IGNORE: OptimizeImagesIgnore = {
	extensions: [],
	// ? The icons of the PWA must stay PNG (the manifest points to them and iOS needs a PNG for the home screen icon).
	folders: ["pwa"],
};

interface CompressFileResult {
	fileName: string;
	originalSizeBytes: number;
	newSizeBytes: number;
	status: "Converted" | "Error";
}

async function optimizeImages(): Promise<void> {
	p.box("🖼️  Image Optimization", "", {
		contentAlign: "center",
		contentPadding: 2,
		rounded: true,
	});

	p.log.warn("⚠️  This script REPLACES the original files with .webp versions!");
	p.log.warn("Press Ctrl+C now to cancel (waiting 5 seconds)...");

	await new Promise((resolve) => setTimeout(resolve, 5000));

	const answer = await p.text({
		message: "Folder with the images to optimize (relative to the app root):",
		initialValue: DEFAULT_IMAGES_DIR,
		validate: (value) => {
			if (!value || !existsSync(value)) {
				return "The folder does not exist.";
			}
		},
	});

	if (p.isCancel(answer)) {
		p.cancel("Operation cancelled.");
		return;
	}

	const imagesDir = answer;

	const scanSpinner = p.spinner();
	scanSpinner.start(`Scanning directory: ${imagesDir}`);

	const scanResult = await scanDirectory({ dir: imagesDir, recursive: true });

	if (scanResult.length === 0) {
		scanSpinner.error("No file found in the given directory.");
		return;
	}

	const filesWithSupportedExtension = scanResult.filter((file) => SUPPORTED_EXTENSIONS.includes(file.ext));
	// ? What is in the ignore list (see `OPTIMIZE_IMAGES_IGNORE` above) is neither converted nor deleted.
	const supportedFiles = filesWithSupportedExtension.filter((file) => !isIgnoredImage(file.relativePath.project, OPTIMIZE_IMAGES_IGNORE));
	const ignoredCount = filesWithSupportedExtension.length - supportedFiles.length;

	if (supportedFiles.length === 0) {
		scanSpinner.error(
			ignoredCount > 0
				? `No supported file left in the given directory (${ignoredCount} ignored).`
				: "No supported file found in the given directory.",
		);
		return;
	}

	scanSpinner.stop("Scan finished.");

	if (ignoredCount > 0) {
		p.log.info(`Ignoring ${ignoredCount} image(s) that are in the ignore list.`);
	}

	const compressionResults: CompressFileResult[] = [];

	const compressSpinner = p.spinner();

	compressSpinner.start(`Compressing ${supportedFiles.length} images...`);

	for (const file of supportedFiles) {
		const dirName = path.dirname(file.relativePath.project);
		try {
			const compressResult = await compressImage({
				imagePath: file.relativePath.project,
				outputPath: dirName,
				options: {
					quality: QUALITY,
					width: WIDTH,
					height: HEIGHT,
				},
				deleteOriginal: true,
			});

			compressionResults.push({
				status: "Converted",
				fileName: file.name,
				originalSizeBytes: compressResult.originalSizeBytes,
				newSizeBytes: compressResult.newSizeBytes,
			});
		} catch {
			compressSpinner.error(`Error compressing ${file.relativePath.project}`);

			compressionResults.push({
				status: "Error",
				fileName: file.name,
				originalSizeBytes: 0,
				newSizeBytes: 0,
			});
		}
	}

	compressSpinner.stop("Compression finished.");

	const result = {
		total: supportedFiles.length,
		errors: compressionResults.filter((r) => r.status === "Error").length,
		success: compressionResults.filter((r) => r.status === "Converted").length,
		oldSizeTotal: compressionResults.reduce((acc, curr) => acc + curr.originalSizeBytes, 0),
		newSizeTotal: compressionResults.reduce((acc, curr) => acc + curr.newSizeBytes, 0),
		economy: compressionResults.reduce((acc, curr) => acc + (curr.originalSizeBytes - curr.newSizeBytes), 0),
	};

	p.log.info("📊 Image optimization summary:");
	console.table(
		compressionResults.map((r) => ({
			...r,
			originalSizeBytes: beautifyBytes(r.originalSizeBytes),
			newSizeBytes: beautifyBytes(r.newSizeBytes),
		})),
		["fileName", "status", "originalSizeBytes", "newSizeBytes"],
	);

	p.log.info(`📁 Converted files: ${result.success}`);
	p.log.info(`❌ Errors: ${result.errors}`);
	p.log.info(`📦 Original size: ${beautifyBytes(result.oldSizeTotal)}`);
	p.log.info(`📦 Final size: ${beautifyBytes(result.newSizeTotal)}`);
	p.log.success(
		`🎉 Total saved: ${beautifyBytes(Math.max(0, result.economy))} (${Math.round((result.economy / result.oldSizeTotal) * 100)}%)`,
	);
}

await optimizeImages();
