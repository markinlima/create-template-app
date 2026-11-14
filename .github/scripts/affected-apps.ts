import { ALL_SUITES } from "./constants/all-suites";
import { affectedPackages } from "./utils/app-tests/affected-packages";
import { selectTargets } from "./utils/app-tests/select-targets";
import { main } from "./utils/github/main";
import { optionalEnv } from "./utils/github/optional-env";
import { setOutputs } from "./utils/github/set-outputs";
import { parseList } from "./utils/parse-list";
import { listWorkspaces } from "./utils/workspaces/list-workspaces";

// NOTE: lists the apps whose Docker test stack must run: the affected ones, or the apps given explicitly (as a release does).
// NOTE: the output feeds the job matrix of reuse-app-tests.yml.
if (import.meta.main) {
  await main(async () => {
    const apps = optionalEnv("APPS");
    const base = optionalEnv("TURBO_SCM_BASE");

    let names: string[] | undefined;
    if (apps) {
      names = parseList(apps);
    } else if (base) {
      names = await affectedPackages(base);
    }

    const targets = selectTargets({
      workspaces: await listWorkspaces(),
      names,
      suites: parseList(optionalEnv("SUITES") ?? ALL_SUITES.join(",")),
    });

    console.log(
      targets.length > 0
        ? `Apps to test: ${targets.map((target) => `${target.name} (${target.suites})`).join(", ")}`
        : "No app with a Docker test stack is affected.",
    );
    setOutputs({
      matrix: JSON.stringify(targets),
      count: String(targets.length),
    });
  });
}
