import { ACTIONLINT_IMAGE } from "./constants/actionlint-image";
import { runWithFiles } from "./utils/docker/run-with-files";
import { main } from "./utils/github/main";

// NOTE: actionlint finds the project through its `.git` folder. HEAD is enough to create it.
if (import.meta.main) {
  await main(async () => {
    const { exitCode } = await runWithFiles({
      image: ACTIONLINT_IMAGE,
      args: ["-color"],
      paths: [".github", ".git/HEAD"],
    });
    process.exit(exitCode);
  });
}
