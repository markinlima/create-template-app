import * as p from "@clack/prompts";

import { dockerDown } from "../docker/docker-down";
import { confirmCleanVolumes } from "./confirm-clean-volumes";
import { handleCancel } from "./handle-cancel";

/** Asks for confirmation and brings every container of the project down. */
export async function stopEverything() {
  const isConfirmed = await p.confirm({
    message: "Nenhum serviço selecionado. Deseja derrubar todos os containers?",
    initialValue: false,
  });

  handleCancel(isConfirmed);

  if (!isConfirmed) {
    p.cancel("Nada foi alterado.");
    return;
  }

  const cleanVolumes = await confirmCleanVolumes();

  const spinner = p.spinner();
  spinner.start("Derrubando todos os containers...");
  await dockerDown({ cleanVolumes });
  spinner.stop("Containers derrubados.");

  p.outro("🛑 Ambiente parado.");
}
