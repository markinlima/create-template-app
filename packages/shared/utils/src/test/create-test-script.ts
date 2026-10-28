import { execSync } from "node:child_process";
import { parseArgs } from "node:util";

export type TestType = "unit" | "integration" | "e2e";

export interface CreateTestScriptOptions {
  args?: string[];
  preload?: string[];
  cwd?: string;
  type: TestType;
}

export interface CreateTestScriptResult {
  execute: () => void;
}

export function createTestScript({
  args = Bun.argv.slice(2),
  cwd = process.cwd(),
  preload = [],
  type,
}: CreateTestScriptOptions): CreateTestScriptResult {
  return {
    execute: () => {
      // strict: false lets us accept arbitrary flags without declaring them, and the
      // tokens stream lets us forward them verbatim to `bun test`.
      const { positionals, tokens } = parseArgs({
        args,
        allowPositionals: true,
        strict: false,
        tokens: true,
      });

      // Reconstruct flags exactly as the user typed them (including their dashes).
      const flags = tokens
        .filter((token) => token.kind === "option")
        .map((token) =>
          token.value !== undefined
            ? `${token.rawName}=${token.value}`
            : token.rawName,
        );

      // Each positional becomes a "<name>.e2e.spec" matcher. With no positionals we
      // fall back to the default ".e2e.spec" matcher, running the whole suite.
      const patterns =
        positionals.length > 0
          ? positionals.map((name) => `${name}.${type}.spec`)
          : [`.${type}.spec`];

      execSync(
        `bun test ${preload.map((p) => `--preload ${p}`).join(" ")} ${patterns.join(" ")} ${flags}`,
        {
          stdio: "inherit",
          cwd,
          env: { ...process.env, NODE_ENV: "test" },
        },
      );
    },
  };
}
