export interface DeployRequestOptions {
  /** Base URL of the Dokploy instance. A trailing slash is ignored. */
  url: string;
  /** Dokploy API token, sent as `x-api-key`. */
  token: string;
  /** Compose to redeploy. */
  composeId: string;
}

/**
 * Builds the request that asks Dokploy to redeploy a compose: it pulls the images just pushed and restarts the services.
 *
 * @param options - See {@link DeployRequestOptions}.
 */
export function buildDeployRequest(options: DeployRequestOptions) {
  const base = options.url.replace(/\/+$/, "");
  return new Request(`${base}/api/compose.deploy`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-key": options.token,
    },
    body: JSON.stringify({ composeId: options.composeId }),
  });
}
