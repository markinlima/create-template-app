import { describe, expect, it } from "bun:test";

import { updateChecker } from "./update-checker-plugin";

interface Emitted {
  fileName: string;
  source: string;
}

function build(plugin: ReturnType<typeof updateChecker>, environment?: string) {
  const emitted: Emitted[] = [];
  const context = {
    environment: environment ? { name: environment } : undefined,
    emitFile: (file: Emitted) => emitted.push(file),
  };
  const hook = plugin.generateBundle as unknown as (
    this: typeof context,
  ) => void;

  hook.call(context);

  return emitted;
}

describe("updateChecker", () => {
  it("writes the build id into version.json", () => {
    const [file] = build(updateChecker({ buildId: "123" }), "client");

    expect(file?.fileName).toBe("version.json");
    expect(JSON.parse(file?.source ?? "")).toEqual({ buildId: "123" });
  });

  it("adds the content of the app and never lets it replace the build id", () => {
    const [file] = build(
      updateChecker({
        buildId: "123",
        fileName: "build.json",
        content: () => ({ release: "1.4.0", buildId: "other" }),
      }),
      "client",
    );

    expect(file?.fileName).toBe("build.json");
    expect(JSON.parse(file?.source ?? "")).toEqual({
      release: "1.4.0",
      buildId: "123",
    });
  });

  it("writes the file only for the client", () => {
    expect(build(updateChecker({ buildId: "1" }), "nitro")).toEqual([]);
  });

  it("defines the same id for the code", () => {
    const config = (
      updateChecker({ buildId: "123" }).config as () => {
        define: Record<string, string>;
      }
    )();

    expect(config.define["import.meta.env.VITE_BUILD_ID"]).toBe('"123"');
  });

  it("gives each run an id made of the time", () => {
    const first = updateChecker();
    const config = (first.config as () => { define: Record<string, string> })();

    expect(config.define["import.meta.env.VITE_BUILD_ID"]).toMatch(
      /^"\d{13}"$/,
    );
  });

  it("names the file without a leading slash, the same way in the build and in development", () => {
    const plugin = updateChecker({ buildId: "123", fileName: "/version.json" });
    const [file] = build(plugin, "client");
    const routes: Record<string, unknown> = {};

    (plugin.configureServer as unknown as (server: unknown) => void)({
      middlewares: {
        use: (path: string, handler: unknown) => {
          routes[path] = handler;
        },
      },
    });

    expect(file?.fileName).toBe("version.json");
    expect(Object.keys(routes)).toEqual(["/version.json"]);
  });

  it("answers the file in development with the id of the code, not with an old build", () => {
    type Handler = (
      request: unknown,
      response: {
        setHeader: (name: string, value: string) => void;
        end: (body: string) => void;
      },
    ) => void;
    const routes: Record<string, Handler> = {};
    const server = {
      middlewares: {
        use: (path: string, handler: Handler) => {
          routes[path] = handler;
        },
      },
    };
    const headers: Record<string, string> = {};
    let body = "";

    (
      updateChecker({ buildId: "123" }).configureServer as unknown as (
        server: unknown,
      ) => void
    )(server);
    routes["/version.json"]?.(
      {},
      {
        setHeader: (name, value) => {
          headers[name] = value;
        },
        end: (text) => {
          body = text;
        },
      },
    );

    expect(JSON.parse(body)).toEqual({ buildId: "123" });
    expect(headers["Cache-Control"]).toBe("no-store");
  });
});
