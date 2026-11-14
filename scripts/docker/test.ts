import * as p from "@clack/prompts";

import { ROOT_DIR } from "./constants/root-dir";
import { DEFAULT_TEST_TARGET } from "./constants/test-stack";
import { findTestProjects } from "./utils/find-test-projects";
import { runAppTests } from "./utils/run-app-tests";
import { handleCancel } from "./utils/terminal/handle-cancel";

const ALL = "all";

/**
 * Runs the tests of the projects in Docker, each in a stack of its own. Run with `bun run script:test-project [project|all] [script] [--keep]`:
 * the project (asked when missing), the script of the project to run (`test:all` by default) and `--keep` to leave the stack up.
 */
async function test() {
  const args = Bun.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const keep = Bun.argv.includes("--keep");
  const target = args[1] ?? DEFAULT_TEST_TARGET;
  const projects = await findTestProjects();

  let choice = args[0];

  if (!choice) {
    const answer = await p.select<string>({
      message: "Os testes de qual projeto?",
      options: [
        ...projects.map((project) => ({
          value: project.id,
          label: project.name,
          hint: project.path,
        })),
        { value: ALL, label: "Todos" },
      ],
    });

    handleCancel(answer);
    choice = answer;
  }

  const ids = projects.map((project) => project.id);
  const selected =
    choice === ALL
      ? projects
      : projects.filter((project) => project.id === choice);
  const unknown = choice !== ALL && selected.length === 0;

  if (unknown) {
    console.error(
      `"${choice}" não tem testes em Docker. Projetos: ${ids.join(", ")}.`,
    );
    process.exit(1);
  }

  const failed: string[] = [];

  for (const project of selected) {
    console.log(`\n▶ ${project.id}: ${target}`);

    const exitCode = await runAppTests({
      project,
      target,
      root: ROOT_DIR,
      keep,
    });

    if (exitCode !== 0) {
      failed.push(project.id);
    }
  }

  if (failed.length > 0) {
    console.error(`\n❌ Falharam: ${failed.join(", ")}`);
    process.exit(1);
  }

  console.log(
    `\n✅ Passaram: ${selected.map((project) => project.id).join(", ")}`,
  );
}

await test();
