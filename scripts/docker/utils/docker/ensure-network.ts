import { DEV_NETWORK } from "../../constants/projects";

/** Creates the shared network of the dev stack when it does not exist yet. An existing one is left as it is. */
export async function ensureNetwork() {
  await Bun.$`docker network create ${DEV_NETWORK}`.quiet().nothrow();
}
