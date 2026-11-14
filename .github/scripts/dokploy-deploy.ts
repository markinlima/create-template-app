import { buildDeployRequest } from "./utils/dokploy/build-deploy-request";
import { CiError } from "./utils/github/ci-error";
import { main } from "./utils/github/main";
import { requireEnv } from "./utils/github/require-env";

// NOTE: asks Dokploy to redeploy a compose. It pulls the images just pushed and restarts the services.
if (import.meta.main) {
  await main(async () => {
    const composeId = requireEnv("COMPOSE_ID");
    console.log(
      `Deploying compose ${composeId} (${process.env.TARGET ?? "unknown"})...`,
    );

    const response = await fetch(
      buildDeployRequest({
        url: requireEnv("DOKPLOY_URL"),
        token: requireEnv("DOKPLOY_API_TOKEN"),
        composeId,
      }),
    );
    if (!response.ok) {
      throw new CiError(
        `Dokploy answered ${response.status}: ${await response.text()}`,
      );
    }
    console.log("Deployment triggered.");
  });
}
