import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import type { PublicFile } from "../../types/public-file";
import { getCacheControl } from "./get-cache-control";
import { loadPublicFiles } from "./load-public-files";
import { respondWithFile } from "./respond-with-file";

const cacheOptions = {
  rules: [
    { match: "/assets/", cacheControl: "public, max-age=31536000, immutable" },
    {
      match: /^\/(images|videos|meta)\//,
      cacheControl: "public, max-age=86400",
    },
  ],
  defaultCacheControl: "no-cache",
};

let directory: string;
let files: Map<string, PublicFile>;

async function write(relativePath: string, content: string) {
  await Bun.write(join(directory, relativePath), content);
}

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "web-server-"));
  await mkdir(join(directory, "assets"));
  await write("index.html", "<html>shell</html>");
  await write("about-us/index.html", "<html>about</html>");
  await write("assets/app-abc.js", "console.log('app');");
  await write("assets/app-abc.js.gz", "gzipped");
  await write("assets/app-abc.js.br", "brotlied");
  await write("assets/app-abc.js.zst", "zstded");
  await write("sw.js", "self.skipWaiting();");
  await write("manifest.webmanifest", "{}");
  await write("images/logo.webp", "image");

  files = await loadPublicFiles(directory, {
    getCacheControl: (pathname) => getCacheControl(pathname, cacheOptions),
  });
});

afterAll(async () => {
  await rm(directory, { recursive: true, force: true });
});

describe("loadPublicFiles", () => {
  it("maps every file to its address, and the index of a folder to the folder", () => {
    expect([...files.keys()].sort()).toEqual([
      "/",
      "/about-us",
      "/about-us/index.html",
      "/assets/app-abc.js",
      "/images/logo.webp",
      "/index.html",
      "/manifest.webmanifest",
      "/sw.js",
    ]);
    expect(files.get("/")).toBe(files.get("/index.html") as PublicFile);
    expect(files.get("/about-us")).toBe(
      files.get("/about-us/index.html") as PublicFile,
    );
  });

  it("keeps the compressed copies as variants, not as files of their own", () => {
    const file = files.get("/assets/app-abc.js") as PublicFile;

    expect(file.gzip).toBeDefined();
    expect(file.brotli).toBeDefined();
    expect(files.has("/assets/app-abc.js.gz")).toBe(false);
    expect(files.has("/assets/app-abc.js.zst")).toBe(false);
    expect(files.get("/sw.js")?.gzip).toBeUndefined();
  });

  it("gives each variant its own ETag, so a cache never mixes two encodings", () => {
    const file = files.get("/assets/app-abc.js") as PublicFile;
    const etags = [file.raw.etag, file.gzip?.etag, file.brotli?.etag];

    expect(new Set(etags).size).toBe(3);
  });

  it("sends the cache rule of the address and the encoding of the variant", async () => {
    const asset = await respondWithFile({
      file: files.get("/assets/app-abc.js") as PublicFile,
      request: new Request("http://x.test/", {
        headers: { "accept-encoding": "gzip" },
      }),
    });

    expect(asset.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(asset.headers.get("content-encoding")).toBe("gzip");
    expect(asset.headers.get("vary")).toBe("Accept-Encoding");
    expect(await asset.text()).toBe("gzipped");

    const worker = respondWithFile({
      file: files.get("/sw.js") as PublicFile,
      request: new Request("http://x.test/", {
        headers: { "accept-encoding": "gzip" },
      }),
    });

    expect(worker.headers.get("cache-control")).toBe("no-cache");
    expect(worker.headers.get("content-encoding")).toBeNull();
    expect(worker.headers.get("vary")).toBeNull();
    expect(files.get("/images/logo.webp")?.raw.init.headers).toMatchObject({
      "Cache-Control": "public, max-age=86400",
    });
  });

  it("puts the headers it is given on every variant, and on the 304", async () => {
    const withHeaders = await loadPublicFiles(directory, {
      headers: { "X-Test": "yes" },
    });
    const file = withHeaders.get("/assets/app-abc.js") as PublicFile;

    for (const variant of [file.raw, file.gzip, file.brotli]) {
      expect(variant?.init.headers).toMatchObject({ "X-Test": "yes" });
      expect(variant?.notModifiedInit.headers).toMatchObject({
        "X-Test": "yes",
      });
    }
  });

  it("types the manifest of the PWA", () => {
    expect(files.get("/manifest.webmanifest")?.raw.init.headers).toMatchObject({
      "Content-Type": "application/manifest+json",
    });
  });

  it("answers 304 with no body when the client already has the variant", () => {
    const file = files.get("/assets/app-abc.js") as PublicFile;
    const response = respondWithFile({
      file,
      request: new Request("http://x.test/", {
        headers: { "if-none-match": file.raw.etag },
      }),
    });

    expect(response.status).toBe(304);
    expect(response.headers.get("etag")).toBe(file.raw.etag);
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(response.body).toBeNull();
  });

  it("keeps a file bigger than the limit on the disk, and a small one in memory", async () => {
    const small = files.get("/sw.js") as PublicFile;
    const onDisk = await loadPublicFiles(directory, { preloadMaxBytes: 5 });
    const big = onDisk.get("/sw.js") as PublicFile;

    expect(small.raw.body).toBeInstanceOf(Uint8Array);
    expect(big.raw.body).not.toBeInstanceOf(Uint8Array);
    expect(
      await respondWithFile({
        file: big,
        request: new Request("http://x.test/"),
      }).text(),
    ).toBe("self.skipWaiting();");
  });
});
