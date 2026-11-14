import {
  type ApiClient,
  createApiClient,
} from "../utils/head-route/create-api-client";
import { getResolvedConfig } from "./get-resolved-config";

let client: ApiClient | undefined;

/** The client of the API the app set in its config. Without one, a call fails (and the page gets the tags of the site) saying what is missing. */
export function getApiClient() {
  const { api } = getResolvedConfig();

  client ??= api
    ? createApiClient(api)
    : {
        get: () =>
          Promise.reject(
            new Error("set `api` in the web server config to ask the API"),
          ),
      };

  return client;
}
