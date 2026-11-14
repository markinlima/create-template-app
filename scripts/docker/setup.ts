import * as p from "@clack/prompts";

import { DNS_HINT } from "./constants/dns-hint";
import { EXTRAS, PROJECTS } from "./constants/projects";
import { ROOT_DIR } from "./constants/root-dir";
import { dockerDown } from "./utils/docker/docker-down";
import { ensureNetwork } from "./utils/docker/ensure-network";
import { isBuildDownloadError } from "./utils/docker/is-build-download-error";
import { runCompose } from "./utils/docker/run-compose";
import { confirmCleanVolumes } from "./utils/terminal/confirm-clean-volumes";
import { handleCancel } from "./utils/terminal/handle-cancel";
import { stopEverything } from "./utils/terminal/stop-everything";

/**
 * Sets up the Docker environment of the project: the user picks the apps and extras, and the root compose starts them under their
 * profiles. Run with `bun run script:setup-project`.
 */
async function setup() {
  console.clear();
  p.intro("🛠️  Ambiente de Desenvolvimento");

  const selected = await p.multiselect<string>({
    message:
      "Quais serviços você deseja inicializar? (nenhum = derrubar todos)",
    required: false,
    options: [...PROJECTS, ...EXTRAS].map((project) => ({
      value: project.value,
      label: project.name,
      hint: project.description,
    })),
  });

  handleCancel(selected);

  if (selected.length === 0) {
    await stopEverything();
    return;
  }

  const isRebuild = await p.confirm({
    message: "Deseja forçar o rebuild das imagens Docker?",
    initialValue: false,
  });

  handleCancel(isRebuild);

  const cleanVolumes = await confirmCleanVolumes();
  const spinner = p.spinner();

  spinner.start("Criando rede Docker (se não existir)...");
  await ensureNetwork();

  spinner.message(
    "Parando containers existentes (para evitar profiles/dependências conflitantes)...",
  );
  await dockerDown({ cleanVolumes });

  spinner.message(
    `Subindo containers (${selected.join(", ")})${isRebuild ? " com build" : ""}...`,
  );

  const { exitCode, stderr } = await runCompose({
    cwd: ROOT_DIR,
    profiles: selected,
    args: ["up", "-d", ...(isRebuild ? ["--build"] : [])],
    quiet: true,
  });

  if (exitCode !== 0) {
    spinner.stop("❌ Falha ao iniciar os containers.");

    if (stderr.trim()) {
      p.note(stderr.trim(), "Detalhes do Erro (Docker)");
    }

    if (isBuildDownloadError(stderr)) {
      p.note(DNS_HINT, "Possível problema de DNS no build");
    }

    p.cancel("Setup abortado devido a erros.");
    process.exit(exitCode);
  }

  spinner.stop("Containers iniciados com sucesso!");
  p.note(
    selected.map((profile) => `• ${profile}`).join("\n"),
    "Serviços Ativos",
  );
  p.outro("✨ Ambiente pronto para desenvolvimento!");
}

await setup();
