/**
 * Size, in bytes, up to which a file is read into memory at start; a bigger one (a video, a WebAssembly) is streamed from the disk.
 * @defaultValue 5242880 (5 MB)
 */
export const DEFAULT_PRELOAD_MAX_BYTES = 5 * 1024 * 1024;
