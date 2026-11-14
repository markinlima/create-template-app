import { describe, expect, it } from "bun:test";

import type { Nitro } from "nitro/types";

import { webServerModule } from "./web-server-module";

function makeNitro({ dev }: { dev: boolean }) {
  const handlers: unknown[] = [];
  const plugins: string[] = [];
  const hooks: string[] = [];

  const nitro = {
    options: {
      dev,
      rootDir: "/app",
      virtual: {},
      routeRules: {},
      handlers,
      plugins,
      output: {
        dir: "/app/dist",
        serverDir: "/app/dist/server",
        publicDir: "/app/dist/client",
      },
    },
    hooks: { hook: (name: string) => hooks.push(name) },
  };

  return { nitro: nitro as unknown as Nitro, handlers, plugins, hooks };
}

/** The source of the runtime module the plugin makes. */
async function readVirtual(nitro: Nitro) {
  const virtual = nitro.options.virtual["#web-server/runtime"];

  return typeof virtual === "function" ? await virtual() : virtual;
}

describe("webServerModule", () => {
  it("registers the handlers and the plugin that read the build, when the server is built", () => {
    const { nitro, handlers, plugins } = makeNitro({ dev: false });

    webServerModule().nitro.setup(nitro);

    expect(handlers.length).toBeGreaterThan(0);
    expect(plugins).toHaveLength(1);
  });

  it("registers no handler, plugin or hook in `vite dev`: Vite serves the app there and there is no build to read, so a handler for every address would only fail", () => {
    const { nitro, handlers, plugins, hooks } = makeNitro({ dev: true });

    webServerModule().nitro.setup(nitro);

    expect(handlers).toHaveLength(0);
    expect(plugins).toHaveLength(0);
    expect(hooks).toHaveLength(0);
  });

  it("still makes the runtime module in `vite dev`, which says it is development: the routes of the app import it", async () => {
    const { nitro } = makeNitro({ dev: true });

    webServerModule().nitro.setup(nitro);

    const source = await readVirtual(nitro);

    expect(source).toContain("export const isDev = true;");
  });

  it("says the server is built (not development) in the runtime module of a build", async () => {
    const { nitro } = makeNitro({ dev: false });

    webServerModule().nitro.setup(nitro);

    const source = await readVirtual(nitro);

    expect(source).toContain("export const isDev = false;");
  });
});
