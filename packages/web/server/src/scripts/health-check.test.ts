import { afterEach, describe, expect, it } from "bun:test";

const SCRIPT = new URL("./health-check.ts", import.meta.url).pathname;

let server: ReturnType<typeof Bun.serve> | undefined;

afterEach(() => {
  server?.stop(true);
  server = undefined;
});

async function runHealthCheck(port: number) {
  const child = Bun.spawn(["bun", SCRIPT], {
    env: { ...process.env, PORT: String(port) },
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    code: await child.exited,
    output: await new Response(child.stderr).text(),
  };
}

describe("health-check script", () => {
  it("exits 0 when the server answers /healthz with 200", async () => {
    server = Bun.serve({
      port: 0,
      fetch: (request) =>
        new URL(request.url).pathname === "/healthz"
          ? new Response("ok")
          : new Response("wrong address", { status: 404 }),
    });

    expect((await runHealthCheck(server.port as number)).code).toBe(0);
  });

  it("exits 1, saying what the server answered, when it is not healthy", async () => {
    server = Bun.serve({
      port: 0,
      fetch: () => new Response("The build is not loaded", { status: 503 }),
    });

    const { code, output } = await runHealthCheck(server.port as number);

    expect(code).toBe(1);
    expect(output).toContain("503");
  });

  it("exits 1 when nothing listens on the port", async () => {
    const free = Bun.serve({ port: 0, fetch: () => new Response() });
    const port = free.port as number;
    free.stop(true);

    expect((await runHealthCheck(port)).code).toBe(1);
  });
});
