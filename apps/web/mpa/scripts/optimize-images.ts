import path from "node:path";

import * as p from "@clack/prompts";

import { beautifyBytes } from "./utils/beautify-bytes";
import { compressImage } from "./utils/compress-image";
import { scanDirectory } from "./utils/scan-directory";

console.clear();

// ? Diretório onde as imagens estão localizadas
const IMAGES_DIR = path.join("public", "images", "test");
// ? Qualidade WebP (0-100, onde 100 é a melhor)
const QUALITY = 80;
// ? Resolução (largura) para redimensionamento de imagens
const WIDTH = 720;
// ? Resolução (altura) para redimensionamento de imagens (undefined para manter a proporção original)
const HEIGHT = undefined;
// ? Extensões de arquivos suportadas para compressão
const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".bmp", ".tiff"];

interface CompressFileResult {
	fileName: string;
	originalSizeBytes: number;
	newSizeBytes: number;
	status: "Converted" | "Error";
}

async function optimizeImages(): Promise<void> {
	p.box("🖼️  Otimização de Imagens", "", {
		contentAlign: "center",
		contentPadding: 2,
		rounded: true,
	});

	p.log.warn("⚠️  Este script SUBSTITUI os arquivos originais por versões .webp!");
	p.log.warn("Pressione Ctrl+C agora para cancelar (aguardando 5 segundos)...");

	await new Promise((resolve) => setTimeout(resolve, 5000));

	const scanSpinner = p.spinner();
	scanSpinner.start(`Iniciando varredura no diretório: ${IMAGES_DIR}`);

	const scanResult = await scanDirectory({ dir: IMAGES_DIR, recursive: true });

	if (scanResult.length === 0) {
		scanSpinner.error("Nenhum arquivo encontrado no diretório especificado.");
		return;
	}

	const supportedFiles = scanResult.filter((file) => SUPPORTED_EXTENSIONS.includes(file.ext));

	if (supportedFiles.length === 0) {
		scanSpinner.error("Nenhum arquivo suportado encontrado no diretório especificado.");
		return;
	}

	scanSpinner.stop("Varredura concluída.");

	const compressionResults: CompressFileResult[] = [];

	const compressSpinner = p.spinner();

	compressSpinner.start(`Iniciando compressão de ${supportedFiles.length} imagens...`);

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
			compressSpinner.error(`Erro ao comprimir ${file.relativePath.project}`);

			compressionResults.push({
				status: "Error",
				fileName: file.name,
				originalSizeBytes: 0,
				newSizeBytes: 0,
			});
		}
	}

	compressSpinner.stop("Compressão concluída.");

	const result = {
		total: supportedFiles.length,
		errors: compressionResults.filter((r) => r.status === "Error").length,
		success: compressionResults.filter((r) => r.status === "Converted").length,
		oldSizeTotal: compressionResults.reduce((acc, curr) => acc + curr.originalSizeBytes, 0),
		newSizeTotal: compressionResults.reduce((acc, curr) => acc + curr.newSizeBytes, 0),
		economy: compressionResults.reduce((acc, curr) => acc + (curr.originalSizeBytes - curr.newSizeBytes), 0),
	};

	p.log.info("📊 Resumo da Otimização de Imagens:");
	console.table(
		compressionResults.map((r) => ({
			...r,
			originalSizeBytes: beautifyBytes(r.originalSizeBytes),
			newSizeBytes: beautifyBytes(r.newSizeBytes),
		})),
		["fileName", "status", "originalSizeBytes", "newSizeBytes"],
	);

	p.log.info(`📁 Arquivos Convertidos: ${result.success}`);
	p.log.info(`❌ Erros: ${result.errors}`);
	p.log.info(`📦 Tamanho Original: ${beautifyBytes(result.oldSizeTotal)}`);
	p.log.info(`📦 Tamanho Final: ${beautifyBytes(result.newSizeTotal)}`);
	p.log.success(
		`🎉 Economia Total: ${beautifyBytes(Math.max(0, result.economy))} (${Math.round((result.economy / result.oldSizeTotal) * 100)}%)`,
	);
}

await optimizeImages();
