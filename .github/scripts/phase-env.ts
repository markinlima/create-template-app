import { CiError } from "./utils/github/ci-error";
import { main } from "./utils/github/main";
import { requireEnv } from "./utils/github/require-env";
import { setOutputs } from "./utils/github/set-outputs";
import { exportBuildEnv } from "./utils/phase/export-build-env";

// NOTE: exports the build-time envs of an app from Phase. The image build reads them as a BuildKit secret.
if (import.meta.main) {
  await main(async () => {
    const appId = requireEnv("PHASE_APP_ID");
    const environment = requireEnv("PHASE_ENV");
    if (!process.env.PHASE_SERVICE_TOKEN) {
      throw new CiError(
        "PHASE_SERVICE_TOKEN is empty. Add the Phase service token to the PHASE_SERVICE_TOKEN repository secret.",
      );
    }

    const { path, count } = await exportBuildEnv({
      appId,
      environment,
      tempDir: requireEnv("RUNNER_TEMP"),
    });
    console.log(`Exported ${count} variables from Phase (${environment}).`);
    setOutputs({ path });
  });
}
