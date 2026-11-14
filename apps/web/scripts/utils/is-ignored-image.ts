import path from "node:path";

export interface OptimizeImagesIgnore {
	/** Extensions (with the dot, in lowercase) the script never touches, wherever the file is. */
	extensions: string[];
	/** Names of folders the script never goes into, at any depth below the folder it was pointed at. */
	folders: string[];
}

/** Tells whether the image is in an ignored folder (at any depth) or has an ignored extension. */
export function isIgnoredImage(imagePath: string, ignore: OptimizeImagesIgnore): boolean {
	const extension = path.extname(imagePath).toLowerCase();
	if (ignore.extensions.some((ignored) => ignored.toLowerCase() === extension)) {
		return true;
	}

	// ? Split by hand and not with `path.dirname`: on Linux it doesn't take `\` as a separator. The last part is the file, the others are folders.
	const folders = imagePath
		.split(/[\\/]/)
		.slice(0, -1)
		.map((folder) => folder.toLowerCase());
	return ignore.folders.some((ignored) => folders.includes(ignored.toLowerCase()));
}
