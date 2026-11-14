import { unlink } from "node:fs/promises";
import path from "node:path";

interface CompressImageProps {
	imagePath: string;
	outputPath: string;
	deleteOriginal?: boolean;
	options: {
		quality: number;
		width: number;
		height?: number;
	};
}

export interface CompressImageResult {
	originalSizeBytes: number;
	newSizeBytes: number;
}

export async function compressImage({ imagePath, outputPath, options, deleteOriginal }: CompressImageProps): Promise<CompressImageResult> {
	const oldFile = Bun.file(imagePath);

	const fileName = path.basename(imagePath, path.extname(imagePath));
	const outputDir = `${outputPath}/${fileName}.webp`;

	await Bun.file(imagePath)
		.image()
		.resize(options.width, options.height, { fit: "inside" })
		.webp({ quality: options.quality })
		.write(outputDir);

	const newFile = Bun.file(outputDir);

	if (deleteOriginal) {
		await unlink(imagePath);
	}

	return {
		originalSizeBytes: oldFile.size,
		newSizeBytes: newFile.size,
	};
}
