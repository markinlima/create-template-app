import * as p from "@clack/prompts";

import { handleCancel } from "./handle-cancel";

/**
 * Asks whether the volumes of the services (their data) are removed too.
 *
 * @returns `true` when the user said yes.
 */
export async function confirmCleanVolumes() {
  const shouldCleanVolumes = await p.confirm({
    message: "Deseja limpar os volumes dos serviços?",
    initialValue: false,
  });

  handleCancel(shouldCleanVolumes);

  return shouldCleanVolumes;
}
