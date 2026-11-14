/** One way a file can be sent: the bytes, its validator and the headers that go with them. */
export interface ServedVariant {
  /** The bytes, or the file itself when it is too big to keep in memory (Bun then streams it, and answers `Range` requests). */
  body: Uint8Array<ArrayBuffer> | Blob;
  etag: string;
  init: ResponseInit;
  /** What a `304` carries: the validators and the cache rule, never the body. */
  notModifiedInit: ResponseInit;
}

/** A file of the build and the compressed copies of it that were written next to it at build time. */
export interface PublicFile {
  raw: ServedVariant;
  gzip?: ServedVariant;
  brotli?: ServedVariant;
}
