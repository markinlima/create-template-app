export function beautifyBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) {
		return "0 Bytes";
	}
	const k = 1024;
	const dm = Math.max(decimals, 0);
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
