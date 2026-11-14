import { describe, expect, it, mock } from "bun:test";

import type { ViteDevServer } from "vite";

import { adblockBait } from "./adblock-bait";
import { BAIT_SOURCE } from "./constants/bait-source";

type Middleware = (
  request: { url?: string },
  response: { setHeader: () => void; end: (body: string) => void },
  next: () => void,
) => void;

function getMiddleware(path?: string) {
  const use = mock<(middleware: Middleware) => void>();
  const plugin = adblockBait({ path });
  const configureServer = plugin.configureServer as (
    server: ViteDevServer,
  ) => void;

  configureServer({ middlewares: { use } } as unknown as ViteDevServer);

  return use.mock.calls[0]?.[0] as Middleware;
}

function runGenerateBundle(environmentName: string | undefined, path?: string) {
  const emitFile = mock();
  const plugin = adblockBait({ path });
  const generateBundle = plugin.generateBundle as (this: unknown) => void;

  generateBundle.call({
    emitFile,
    environment: environmentName ? { name: environmentName } : undefined,
  });

  return emitFile;
}

describe("adblockBait", () => {
  it("answers the bait address in `vite dev` with a script", () => {
    const end = mock();
    const next = mock();

    getMiddleware()(
      { url: "/ads/ads.js?bait=1" },
      { setHeader: mock(), end },
      next,
    );

    expect(end).toHaveBeenCalledWith(BAIT_SOURCE);
    expect(next).not.toHaveBeenCalled();
  });

  it("lets every other address through", () => {
    const end = mock();
    const next = mock();

    getMiddleware()({ url: "/app" }, { setHeader: mock(), end }, next);

    expect(next).toHaveBeenCalled();
    expect(end).not.toHaveBeenCalled();
  });

  it("writes the file into the client build", () => {
    expect(runGenerateBundle("client")).toHaveBeenCalledWith({
      type: "asset",
      fileName: "ads/ads.js",
      source: BAIT_SOURCE,
    });
  });

  it("writes it when the build has no environments", () => {
    expect(runGenerateBundle(undefined)).toHaveBeenCalledTimes(1);
  });

  it("skips the server environment", () => {
    expect(runGenerateBundle("ssr")).not.toHaveBeenCalled();
  });

  it("uses another path when given", () => {
    expect(runGenerateBundle("client", "/pub/banner.js")).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: "pub/banner.js" }),
    );
  });
});
