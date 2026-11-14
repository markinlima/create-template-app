import { buildTestImages } from "./utils/app-tests/build-test-images";
import { runSuites } from "./utils/app-tests/run-suites";
import { main } from "./utils/github/main";
import { requireEnv } from "./utils/github/require-env";
import { parseList } from "./utils/parse-list";

// NOTE: the app's test compose file is the only source of what to build. Each `build` becomes a plain `docker build`.
// NOTE: there is no layer cache. The GitHub Actions cache is only readable by the same ref, so a PR cannot read what a push wrote.
// NOTE: a plain `docker build` puts the image straight into the daemon, with no tarball to export and load.
if (import.meta.main) {
  await main(async () => {
    const app = requireEnv("APP_NAME");
    const path = requireEnv("APP_PATH");
    const suites = parseList(requireEnv("SUITES"));

    await buildTestImages(path);

    const failed = await runSuites({ app, path, suites });
    if (failed.length > 0) {
      process.exit(1);
    }
    console.log(`All ${app} suites passed: ${suites.join(", ")}.`);
  });
}
